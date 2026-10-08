/**
 * Chief Judge Slot Management API Routes
 * 
 * Handles CJ slot purchases, queue management, and auto-expiry
 */

export const CJ_SLOT_PURCHASE_ROUTE = `
// src/app/api/cj-slots/purchase/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const CJ_PRICE_NAIRA = 3500;
const CJ_TENURE_DAYS = 14;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { religion } = await req.json();

    // Validate religion
    if (!['MUSLIM', 'CHRISTIAN'].includes(religion)) {
      return NextResponse.json(
        { error: 'Invalid religion. Must be MUSLIM or CHRISTIAN' },
        { status: 400 }
      );
    }

    // Get user and verify religion matches
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.religion !== religion) {
      return NextResponse.json(
        { error: 'Religion mismatch. Your registered religion does not match the slot you are trying to purchase.' },
        { status: 400 }
      );
    }

    // Check slot availability
    const currentSlotHolder = await prisma.user.findFirst({
      where: {
        role: 'CHIEF_JUDGE',
        cjSlotReligion: religion,
        cjSlotExpiry: {
          gt: new Date(),
        },
      },
    });

    let slotStatus: 'IMMEDIATE' | 'QUEUED';
    let queuePosition: number | null = null;

    if (currentSlotHolder) {
      // Slot is occupied - add to queue
      slotStatus = 'QUEUED';
      
      // Count people already in queue for this religion
      const queueCount = await prisma.cjQueue.count({
        where: {
          religion: religion,
          activatedAt: null,
        },
      });
      
      queuePosition = queueCount + 1;
      
      // Add to queue
      await prisma.cjQueue.create({
         {
          userId: user.id,
          religion: religion,
          position: queuePosition,
        },
      });
    } else {
      // Slot is available
      slotStatus = 'IMMEDIATE';
    }

    // Initialize Paystack transaction
    const amountInKobo = CJ_PRICE_NAIRA * 100;
    
    const response = await fetch(\`\${PAYSTACK_BASE_URL}/transaction/initialize\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${PAYSTACK_SECRET_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.encryptedEmail,
        amount: amountInKobo,
        currency: 'NGN',
        reference: \`CJ-\${Date.now()}-\${user.id}\`,
        meta {
          custom_fields: [
            {
              display_name: 'Purchase Type',
              variable_name: 'purchase_type',
              value: 'CJ_SLOT',
            },
            {
              display_name: 'Religion',
              variable_name: 'religion',
              value: religion,
            },
            {
              display_name: 'User ID',
              variable_name: 'user_id',
              value: user.id,
            },
            {
              display_name: 'Slot Status',
              variable_name: 'slot_status',
              value: slotStatus,
            },
            {
              display_name: 'Queue Position',
              variable_name: 'queue_position',
              value: queuePosition?.toString() || '0',
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || 'Failed to initialize transaction' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      accessCode: data.data.access_code,
      slotStatus,
      queuePosition,
      tenureDays: CJ_TENURE_DAYS,
      price: CJ_PRICE_NAIRA,
    });

  } catch (error) {
    console.error('CJ slot purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

export const CJ_SLOT_WEBHOOK_ROUTE = `
// src/app/api/cj-slots/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { prisma } from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const CJ_TENURE_DAYS = 14;

export async function POST(req: NextRequest) {
  try {
    // Verify Paystack signature
    const signature = req.headers.get('x-paystack-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    const body = await req.text();
    
    // Verify SHA512 signature
    const hash = createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // Only process successful charges
    if (event.event !== 'charge.success') {
      return NextResponse.json({ message: 'Event ignored' });
    }

    const { data } = event;
    const metadata = data.metadata;

    if (!metadata?.custom_fields) {
      return NextResponse.json(
        { error: 'Missing metadata' },
        { status: 400 }
      );
    }

    // Extract custom fields
    const customFields = metadata.custom_fields;
    const purchaseType = customFields.find(f => f.variable_name === 'purchase_type')?.value;
    
    if (purchaseType !== 'CJ_SLOT') {
      return NextResponse.json({ message: 'Not a CJ slot purchase' });
    }

    const religion = customFields.find(f => f.variable_name === 'religion')?.value;
    const userId = customFields.find(f => f.variable_name === 'user_id')?.value;
    const slotStatus = customFields.find(f => f.variable_name === 'slot_status')?.value;

    if (!userId || !religion) {
      return NextResponse.json(
        { error: 'Missing required metadata' },
        { status: 400 }
      );
    }

    // Atomic transaction
    await prisma.$transaction(async (tx) => {
      if (slotStatus === 'IMMEDIATE') {
        // Activate immediately
        const now = new Date();
        const expiresAt = new Date(now.getTime() + CJ_TENURE_DAYS * 24 * 60 * 60 * 1000);

        await tx.user.update({
          where: { id: userId },
           {
            role: 'CHIEF_JUDGE',
            cjSlotReligion: religion,
            cjSlotExpiry: expiresAt,
          },
        });
      } else {
        // Mark queue entry as paid (will be activated when slot opens)
        await tx.cjQueue.updateMany({
          where: {
            userId: userId,
            religion: religion,
            activatedAt: null,
          },
           {
            paidAt: new Date(),
          },
        });
      }
    });

    return NextResponse.json({ message: 'CJ slot purchase processed successfully' });

  } catch (error) {
    console.error('CJ slot webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
`;

export const CJ_SLOT_CRON_ROUTE = `
// src/app/api/cron/cj-slot-expiry/route.ts
// Cron job to expire CJ slots and promote from queue
// Run every hour via Vercel Cron or similar

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CJ_TENURE_DAYS = 14;

export async function GET(req: Request) {
  try {
    // Verify cron secret (security)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find expired CJ slots
    const expiredCJs = await prisma.user.findMany({
      where: {
        role: 'CHIEF_JUDGE',
        cjSlotExpiry: {
          lt: now,
        },
      },
    });

    for (const cj of expiredCJs) {
      await prisma.$transaction(async (tx) => {
        // Demote CJ back to LISTENER
        await tx.user.update({
          where: { id: cj.id },
           {
            role: 'LISTENER',
            cjSlotExpiry: null,
            cjSlotReligion: null,
          },
        });

        // Find next in queue for this religion
        const nextInQueue = await tx.cjQueue.findFirst({
          where: {
            religion: cj.cjSlotReligion,
            activatedAt: null,
            paidAt: { not: null }, // Only promote paid users
          },
          orderBy: {
            position: 'asc',
          },
        });

        if (nextInQueue) {
          // Promote to CJ
          const expiresAt = new Date(now.getTime() + CJ_TENURE_DAYS * 24 * 60 * 60 * 1000);
          
          await tx.user.update({
            where: { id: nextInQueue.userId },
             {
              role: 'CHIEF_JUDGE',
              cjSlotReligion: cj.cjSlotReligion,
              cjSlotExpiry: expiresAt,
            },
          });

          // Mark queue entry as activated
          await tx.cjQueue.update({
            where: { id: nextInQueue.id },
             {
              activatedAt: now,
            },
          });

          // Recalculate queue positions
          const remainingQueue = await tx.cjQueue.findMany({
            where: {
              religion: cj.cjSlotReligion,
              activatedAt: null,
            },
            orderBy: {
              position: 'asc',
            },
          });

          for (let i = 0; i < remainingQueue.length; i++) {
            await tx.cjQueue.update({
              where: { id: remainingQueue[i].id },
               {
                position: i + 1,
              },
            });
          }

          // TODO: Send notification to promoted user
          console.log(\`Promoted \${nextInQueue.userId} to CJ for \${cj.cjSlotReligion} slot\`);
        }

        console.log(\`Expired CJ slot for \${cj.id} (\${cj.cjSlotReligion})\`);
      });
    }

    return NextResponse.json({
      message: 'CJ slot expiry check completed',
      expiredCount: expiredCJs.length,
    });

  } catch (error) {
    console.error('CJ slot expiry cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    );
  }
}
`;

export const CJ_SLOT_SCHEMA_ADDITIONS = `
// Add to prisma/schema.prisma

enum Religion {
  MUSLIM
  CHRISTIAN
}

// Add to User model
model User {
  // ... existing fields ...
  
  religion        Religion?
  cjSlotExpiry    DateTime?
  cjSlotReligion  String?  // MUSLIM or CHRISTIAN
  
  cjQueueEntries  CJQueue[]
}

// New CJ Queue model
model CJQueue {
  id          String    @id @default(cuid())
  userId      String
  religion    Religion
  position    Int
  joinedAt    DateTime  @default(now())
  paidAt      DateTime?
  activatedAt DateTime?
  
  user        User      @relation(fields: [userId], references: [id])
  
  @@index([religion, position])
  @@index([userId, religion])
}
`;
