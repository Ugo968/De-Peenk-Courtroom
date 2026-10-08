/**
 * Paystack API Routes for De Peenk Courtroom
 * 
 * These are Next.js App Router API routes for production use.
 * In the current Vite environment, these serve as reference implementation.
 */

export const PAYSTACK_INITIALIZE_ROUTE = `
// src/app/api/paystack/initialize/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Package pricing in Naira
const PACKAGES = {
  LISTENER: { amount: 1000, credits: 10000, label: 'Listener Pack' },
  LAWYER: { amount: 2000, credits: 30000, label: 'Lawyer Pack' },
  TESTIFIER: { amount: 150, credits: 500, label: 'Testifier Pack' },
  PLAINTIFF_FILING: { amount: 100, credits: 500, label: 'Plaintiff Filing' },
  CJ_SEAT: { amount: 3500, credits: 0, label: 'Chief Judge Seat (2 weeks)' },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { packageType } = await req.json();

    if (!packageType || !PACKAGES[packageType]) {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      );
    }

    const pkg = PACKAGES[packageType];
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { wallet: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Convert Naira to Kobo (1 Naira = 100 Kobo)
    const amountInKobo = pkg.amount * 100;

    // Initialize Paystack transaction
    const response = await fetch(\`\${PAYSTACK_BASE_URL}/transaction/initialize\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${PAYSTACK_SECRET_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.encryptedEmail, // In production, decrypt first
        amount: amountInKobo,
        currency: 'NGN',
        reference: \`DPC-\${Date.now()}-\${user.id}\`,
        metadata: {
          custom_fields: [
            {
              display_name: 'Package Type',
              variable_name: 'package_type',
              value: packageType,
            },
            {
              display_name: 'Credits',
              variable_name: 'credits',
              value: pkg.credits,
            },
            {
              display_name: 'User ID',
              variable_name: 'user_id',
              value: user.id,
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
    });

  } catch (error) {
    console.error('Paystack initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

export const PAYSTACK_WEBHOOK_ROUTE = `
// src/app/api/paystack/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { prisma } from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

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
    const packageType = customFields.find(f => f.variable_name === 'package_type')?.value;
    const credits = parseInt(customFields.find(f => f.variable_name === 'credits')?.value || '0');
    const userId = customFields.find(f => f.variable_name === 'user_id')?.value;

    if (!userId || !packageType) {
      return NextResponse.json(
        { error: 'Missing required metadata' },
        { status: 400 }
      );
    }

    // Atomic transaction to update wallet
    await prisma.$transaction(async (tx) => {
      // Handle Chief Judge Seat (special case - time-based access)
      if (packageType === 'CJ_SEAT') {
        await tx.user.update({
          where: { id: userId },
          data: {
            role: 'CHIEF_JUDGE',
            // Add expiration logic in production
          },
        });
      } else {
        // Update or create wallet with credits
        await tx.wallet.upsert({
          where: { userId },
          update: {
            balance: {
              increment: credits,
            },
            lastFundedAt: new Date(),
          },
          create: {
            userId,
            balance: credits,
            lastFundedAt: new Date(),
          },
        });
      }
    });

    return NextResponse.json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
`;

export const VIRTUAL_LAWYER_REWARD_LOGIC = `
// src/lib/virtualRewards.ts
// Gamified virtual lawyer credit system (NOT real money)

import { prisma } from '@/lib/prisma';

/**
 * Reward a lawyer for winning/resolving a case
 * This is purely gamified - no real money involved
 */
export async function rewardLawyerForWin(lawyerId: string, caseId: string) {
  await prisma.$transaction(async (tx) => {
    // Increment virtual lawyer credits by 400
    await tx.user.update({
      where: { id: lawyerId },
      data: {
        virtualLawyerCredits: {
          increment: 400,
        },
        casesWon: {
          increment: 1,
        },
      },
    });

    // Optional: Update case status
    await tx.case.update({
      where: { id: caseId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });
  });
}

/**
 * Calculate lawyer level based on virtual credits
 */
export function calculateLawyerLevel(virtualCredits: number): number {
  // Level progression: every 1000 credits = 1 level
  return Math.floor(virtualCredits / 1000) + 1;
}
`;
