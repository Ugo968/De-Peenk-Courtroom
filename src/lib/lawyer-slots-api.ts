/**
 * Lawyer Slot Management API Routes
 * 
 * Handles lawyer slot purchases, waitlist management, and auto-expiry
 */

export const LAWYER_SLOT_PURCHASE_ROUTE = `
// src/app/api/lawyer-slots/purchase/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const LAWYER_PRICE_NAIRA = 2000;
const LAWYER_TENURE_DAYS = 14;
const LAWYER_SLOT_PER_RELIGION = 10;

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

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // CRITICAL: Gender validation - only females can become lawyers
    if (user.gender !== 'FEMALE') {
      return NextResponse.json(
        { error: 'Only women can become lawyers on De Peenk Courtroom.' },
        { status: 403 }
      );
    }

    // Verify religion matches
    if (user.religion !== religion) {
      return NextResponse.json(
        { error: 'Religion mismatch. Your registered religion does not match the slot you are trying to purchase.' },
        { status: 400 }
      );
    }

    // Check slot availability for this religion
    const activeLawyersCount = await prisma.user.count({
      where: {
        role: 'LAWYER',
        religion: religion,
        lawyerSlotExpiry: {
          gt: new Date(),
        },
      },
    });

    let slotStatus: 'IMMEDIATE' | 'WAITLISTED';
    let waitlistPosition: number | null = null;

    if (activeLawyersCount >= LAWYER_SLOT_PER_RELIGION) {
      // All slots occupied - add to waitlist
      slotStatus = 'WAITLISTED';
      
      // Count people already in waitlist for this religion
      const waitlistCount = await prisma.lawyerWaitlist.count({
        where: {
          religion: religion,
          activatedAt: null,
        },
      });
      
      waitlistPosition = waitlistCount + 1;
      
      // Add to waitlist
      await prisma.lawyerWaitlist.create({
         {
          userId: user.id,
          religion: religion,
          position: waitlistPosition,
        },
      });
    } else {
      // Slot is available
      slotStatus = 'IMMEDIATE';
    }

    // Initialize Paystack transaction
    const amountInKobo = LAWYER_PRICE_NAIRA * 100;
    
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
        reference: \`LAWYER-\${Date.now()}-\${user.id}\`,
        meta {
          custom_fields: [
            {
              display_name: 'Purchase Type',
              variable_name: 'purchase_type',
              value: 'LAWYER_SLOT',
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
              display_name: 'Waitlist Position',
              variable_name: 'waitlist_position',
              value: waitlistPosition?.toString() || '0',
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
      waitlistPosition,
      tenureDays: LAWYER_TENURE_DAYS,
      price: LAWYER_PRICE_NAIRA,
    });

  } catch (error) {
    console.error('Lawyer slot purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

export const LAWYER_SLOT_WEBHOOK_ROUTE = `
// src/app/api/lawyer-slots/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { prisma } from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const LAWYER_TENURE_DAYS = 14;

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
    
    if (purchaseType !== 'LAWYER_SLOT') {
      return NextResponse.json({ message: 'Not a lawyer slot purchase' });
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
        const expiresAt = new Date(now.getTime() + LAWYER_TENURE_DAYS * 24 * 60 * 60 * 1000);

        await tx.user.update({
          where: { id: userId },
           {
            role: 'LAWYER',
            religion: religion,
            lawyerSlotExpiry: expiresAt,
          },
        });
      } else {
        // Mark waitlist entry as paid (will be activated when slot opens)
        await tx.lawyerWaitlist.updateMany({
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

    return NextResponse.json({ message: 'Lawyer slot purchase processed successfully' });

  } catch (error) {
    console.error('Lawyer slot webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
`;

export const LAWYER_SLOT_CRON_ROUTE = `
// src/app/api/cron/lawyer-slot-expiry/route.ts
// Cron job to expire lawyer slots and promote from waitlist
// Run every hour via Vercel Cron or similar

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const LAWYER_TENURE_DAYS = 14;

export async function GET(req: Request) {
  try {
    // Verify cron secret (security)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find expired lawyer slots
    const expiredLawyers = await prisma.user.findMany({
      where: {
        role: 'LAWYER',
        lawyerSlotExpiry: {
          lt: now,
        },
      },
    });

    for (const lawyer of expiredLawyers) {
      await prisma.$transaction(async (tx) => {
        // Demote lawyer back to LISTENER
        await tx.user.update({
          where: { id: lawyer.id },
           {
            role: 'LISTENER',
            lawyerSlotExpiry: null,
          },
        });

        // Find next in waitlist for this religion
        const nextInWaitlist = await tx.lawyerWaitlist.findFirst({
          where: {
            religion: lawyer.religion,
            activatedAt: null,
            paidAt: { not: null }, // Only promote paid users
          },
          orderBy: {
            position: 'asc',
          },
        });

        if (nextInWaitlist) {
          // Promote to Lawyer
          const expiresAt = new Date(now.getTime() + LAWYER_TENURE_DAYS * 24 * 60 * 60 * 1000);
          
          await tx.user.update({
            where: { id: nextInWaitlist.userId },
             {
              role: 'LAWYER',
              religion: lawyer.religion,
              lawyerSlotExpiry: expiresAt,
            },
          });

          // Mark waitlist entry as activated
          await tx.lawyerWaitlist.update({
            where: { id: nextInWaitlist.id },
             {
              activatedAt: now,
            },
          });

          // Recalculate waitlist positions
          const remainingWaitlist = await tx.lawyerWaitlist.findMany({
            where: {
              religion: lawyer.religion,
              activatedAt: null,
            },
            orderBy: {
              position: 'asc',
            },
          });

          for (let i = 0; i < remainingWaitlist.length; i++) {
            await tx.lawyerWaitlist.update({
              where: { id: remainingWaitlist[i].id },
               {
                position: i + 1,
              },
            });
          }

          // TODO: Send notification to promoted user
          console.log(\`Promoted \${nextInWaitlist.userId} to Lawyer for \${lawyer.religion} slot\`);
        }

        console.log(\`Expired Lawyer slot for \${lawyer.id} (\${lawyer.religion})\`);
      });
    }

    return NextResponse.json({
      message: 'Lawyer slot expiry check completed',
      expiredCount: expiredLawyers.length,
    });

  } catch (error) {
    console.error('Lawyer slot expiry cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    );
  }
}
`;

export const SIGNUP_VALIDATION_ROUTE = `
// src/app/api/auth/signup/route.ts
// Enhanced signup with gender and religion validation

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, religion, gender } = await req.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !religion || !gender) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate religion
    if (!['MUSLIM', 'CHRISTIAN'].includes(religion)) {
      return NextResponse.json(
        { error: 'Invalid religion. Must be MUSLIM or CHRISTIAN' },
        { status: 400 }
      );
    }

    // Validate gender
    if (!['MALE', 'FEMALE'].includes(gender)) {
      return NextResponse.json(
        { error: 'Invalid gender. Must be MALE or FEMALE' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate anonymous handle based on role (default LISTENER)
    // ... handle generation logic ...

    // Create user
    const user = await prisma.user.create({
       {
        email,
        encryptedPassword: hashedPassword,
        encryptedFirstName: firstName, // In production, encrypt these
        encryptedLastName: lastName,
        encryptedPhone: phone,
        religion,
        gender,
        role: 'LISTENER', // Default role
        anonymousHandle: 'FL-XXXX99', // Generate properly
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      userId: user.id,
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

export const LAWYER_SLOT_SCHEMA_ADDITIONS = `
// Add to prisma/schema.prisma

enum Gender {
  MALE
  FEMALE
}

// Add to User model
model User {
  // ... existing fields ...
  
  gender           Gender?
  lawyerSlotExpiry DateTime?
  
  lawyerWaitlistEntries LawyerWaitlist[]
}

// New Lawyer Waitlist model
model LawyerWaitlist {
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
