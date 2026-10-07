/**
 * Trial System API Routes
 * 
 * Handles trial initialization and expiry management
 */

export const TRIAL_API_ROUTES = `
// src/app/api/trial/initialize/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const TRIAL_DURATION_DAYS = 3;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Check if trial already active
    if (user.trialEndsAt && new Date(user.trialEndsAt) > new Date()) {
      return NextResponse.json(
        { error: 'Trial already active' },
        { status: 400 }
      );
    }

    // Calculate trial end date (3 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DURATION_DAYS);

    // Grant initial trial credits based on gender
    const isMale = user.gender === 'MALE';
    const initialCredits = isMale ? 50 : 100;
    const initialCoins = 50;

    // Atomic transaction
    await prisma.$transaction(async (tx) => {
      // Set trial end date
      await tx.user.update({
        where: { id: user.id },
         {
          trialEndsAt: trialEndsAt,
        },
      });

      // Create or update wallet with initial credits
      if (user.wallet) {
        await tx.wallet.update({
          where: { userId: user.id },
           {
            balance: {
              increment: initialCredits + initialCoins,
            },
          },
        });
      } else {
        await tx.wallet.create({
           {
            userId: user.id,
            balance: initialCredits + initialCoins,
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      trialEndsAt: trialEndsAt.toISOString(),
      initialCredits,
      initialCoins,
      message: 'Free trial activated successfully',
    });

  } catch (error) {
    console.error('Trial initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// src/app/api/cron/trial-expiry/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();

    // Find users with expired trials
    const expiredTrials = await prisma.user.findMany({
      where: {
        trialEndsAt: {
          lt: now,
        },
        role: 'LISTENER', // Only downgrade if still on trial role
      },
      include: { wallet: true },
    });

    const results = [];

    for (const user of expiredTrials) {
      await prisma.$transaction(async (tx) => {
        // Clear trial end date
        await tx.user.update({
          where: { id: user.id },
           {
            trialEndsAt: null,
          },
        });

        results.push({
          userId: user.id,
          email: user.email,
          trialEndedAt: user.trialEndsAt,
          message: 'Trial expired, user downgraded to free tier',
        });
      });
    }

    return NextResponse.json({
      success: true,
      expiredCount: results.length,
      results,
    });

  } catch (error) {
    console.error('Trial expiry cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// src/app/api/trial/status/route.ts

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const trialEndsAt = user.trialEndsAt;
    const now = new Date();
    const isActive = trialEndsAt && new Date(trialEndsAt) > now;

    return NextResponse.json({
      isActive,
      trialEndsAt: trialEndsAt?.toISOString() || null,
      isMale: user.gender === 'MALE',
    });

  } catch (error) {
    console.error('Trial status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

export const TRIAL_SCHEMA_ADDITIONS = `
// Add to prisma/schema.prisma

model User {
  // ... existing fields ...
  
  // Trial system
  trialEndsAt DateTime?
}
`;
