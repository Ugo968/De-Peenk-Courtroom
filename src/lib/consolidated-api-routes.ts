/**
 * De Peenk Courtroom - Consolidated API Routes Reference
 * 
 * This file contains all API route implementations for the Next.js backend.
 * Copy these routes to your Next.js app/api directory.
 */

// ═══════════════════════════════════════════════════════
// AUTH & SIGNUP (with gender, religion, male pricing)
// ═══════════════════════════════════════════════════════

export const AUTH_SIGNUP_ROUTE = `
// src/app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateAnonymousHandle } from '@/lib/identity';

const TRIAL_DURATION_DAYS = 3;

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, gender, religion } = await req.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !gender || !religion) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Validate religion
    if (!['MUSLIM', 'CHRISTIAN'].includes(religion)) {
      return NextResponse.json(
        { error: 'Invalid religion. Must be MUSLIM or CHRISTIAN' },
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

    // Generate anonymous handle
    const anonymousHandle = generateAnonymousHandle({
      role: 'LISTENER',
      firstName,
      lastName,
      phone,
      gender,
      religion,
    });

    // Calculate trial end date (3 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DURATION_DAYS);

    // Grant initial trial credits based on gender
    const isMale = gender === 'MALE';
    const initialListenerCredits = isMale ? 50 : 100;
    const initialCoins = 50;

    // Create user with trial
    const user = await prisma.user.create({
       {
        email,
        encryptedPassword: hashedPassword,
        encryptedFirstName: firstName,
        encryptedLastName: lastName,
        encryptedPhone: phone,
        encryptedEmail: email,
        gender,
        religion,
        role: 'LISTENER',
        anonymousHandle,
        trialEndsAt,
        listenerCredits: initialListenerCredits,
        dailyStreak: 1,
        lastLoginDate: new Date(),
      },
    });

    // Create wallet with initial coins
    await prisma.wallet.create({
       {
        userId: user.id,
        balance: initialCoins,
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      userId: user.id,
      anonymousHandle,
      trialEndsAt: trialEndsAt.toISOString(),
      initialListenerCredits,
      initialCoins,
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

// ═══════════════════════════════════════════════════════
// CJ SLOT CLAIM (with religion slot checking)
// ═══════════════════════════════════════════════════════

export const CJ_CLAIM_SLOT_ROUTE = `
// src/app/api/cj/claim-slot/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // CRITICAL: Gender validation - only females can become CJ
    if (user.gender !== 'FEMALE') {
      return NextResponse.json(
        { error: 'Only women can become Chief Judges on De Peenk Courtroom.' },
        { status: 403 }
      );
    }

    // Check if slot for user's religion is available
    const currentCJ = await prisma.user.findFirst({
      where: {
        role: 'CHIEF_JUDGE',
        cjSlotReligion: user.religion,
        cjSlotExpiry: {
          gt: new Date(),
        },
      },
    });

    if (currentCJ) {
      // Slot occupied - add to queue
      const queueCount = await prisma.cjQueue.count({
        where: {
          religion: user.religion,
          activatedAt: null,
        },
      });

      await prisma.cjQueue.create({
         {
          userId: user.id,
          religion: user.religion,
          position: queueCount + 1,
        },
      });

      return NextResponse.json({
        status: 'QUEUED',
        queuePosition: queueCount + 1,
        message: \`Slot occupied. You've been added to queue at position \${queueCount + 1}\`,
      });
    }

    // Slot available - activate immediately
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CJ_TENURE_DAYS * 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
       {
        role: 'CHIEF_JUDGE',
        cjSlotReligion: user.religion,
        cjSlotExpiry: expiresAt,
      },
    });

    return NextResponse.json({
      status: 'IMMEDIATE',
      message: 'Congratulations! You are now the Chief Judge!',
      expiresAt: expiresAt.toISOString(),
    });

  } catch (error) {
    console.error('CJ slot claim error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

// ═══════════════════════════════════════════════════════
// LAWYER SLOT CLAIM (with religion slot checking)
// ═══════════════════════════════════════════════════════

export const LAWYER_CLAIM_SLOT_ROUTE = `
// src/app/api/lawyer/claim-slot/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Check how many active lawyers for this religion
    const activeLawyers = await prisma.user.count({
      where: {
        role: 'LAWYER',
        religion: user.religion,
        lawyerSlotExpiry: {
          gt: new Date(),
        },
      },
    });

    if (activeLawyers >= LAWYER_SLOT_PER_RELIGION) {
      // All slots occupied - add to waitlist
      const waitlistCount = await prisma.lawyerWaitlist.count({
        where: {
          religion: user.religion,
          activatedAt: null,
        },
      });

      await prisma.lawyerWaitlist.create({
         {
          userId: user.id,
          religion: user.religion,
          position: waitlistCount + 1,
        },
      });

      return NextResponse.json({
        status: 'WAITLISTED',
        waitlistPosition: waitlistCount + 1,
        message: \`All slots occupied. You've been added to waitlist at position \${waitlistCount + 1}\`,
      });
    }

    // Slot available - activate immediately
    const now = new Date();
    const expiresAt = new Date(now.getTime() + LAWYER_TENURE_DAYS * 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
       {
        role: 'LAWYER',
        lawyerSlotExpiry: expiresAt,
      },
    });

    return NextResponse.json({
      status: 'IMMEDIATE',
      message: 'Congratulations! You are now a Lawyer!',
      expiresAt: expiresAt.toISOString(),
    });

  } catch (error) {
    console.error('Lawyer slot claim error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

// ═══════════════════════════════════════════════════════
// VIDEO AD WATCH (credit reward logic)
// ═══════════════════════════════════════════════════════

export const ADS_WATCH_VIDEO_ROUTE = `
// src/app/api/ads/watch-video/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const CREDITS_PER_VIDEO = 10;
const MAX_VIDEOS_PER_DAY = 20;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { videoId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check role exemption - Lawyers and CJs cannot watch video ads
    if (user.role === 'LAWYER' || user.role === 'CHIEF_JUDGE') {
      return NextResponse.json(
        { error: 'Lawyers and Chief Judges are exempt from video ads.' },
        { status: 403 }
      );
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create today's video view record
    let videoView = await prisma.adVideoView.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
    });

    if (!videoView) {
      videoView = await prisma.adVideoView.create({
         {
          userId: user.id,
          date: today,
          count: 0,
        },
      });
    }

    // Check daily limit
    if (videoView.count >= MAX_VIDEOS_PER_DAY) {
      return NextResponse.json(
        { 
          error: \`Daily limit reached. You can watch maximum \${MAX_VIDEOS_PER_DAY} videos per day.\`,
          videosWatchedToday: videoView.count,
        },
        { status: 429 }
      );
    }

    // Atomic transaction: increment video count and award credits
    const result = await prisma.$transaction(async (tx) => {
      // Increment video count
      await tx.adVideoView.update({
        where: { id: videoView.id },
         {
          count: {
            increment: 1,
          },
        },
      });

      // Award credits to user's wallet
      await tx.wallet.update({
        where: { userId: user.id },
         {
          balance: {
            increment: CREDITS_PER_VIDEO,
          },
        },
      });

      const updatedWallet = await tx.wallet.findUnique({
        where: { userId: user.id },
      });

      return {
        videosWatchedToday: videoView.count + 1,
        creditsEarned: CREDITS_PER_VIDEO,
        newBalance: updatedWallet?.balance || 0,
      };
    });

    return NextResponse.json({
      success: true,
      message: \`Congratulations! You earned \${CREDITS_PER_VIDEO} credits!\`,
      ...result,
    });

  } catch (error) {
    console.error('Video reward error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

// ═══════════════════════════════════════════════════════
// TENURE END (credit conversion logic)
// ═══════════════════════════════════════════════════════

export const TENURE_END_ROUTE = `
// src/app/api/tenure/end/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find expired lawyers
    const expiredLawyers = await prisma.user.findMany({
      where: {
        role: 'LAWYER',
        lawyerSlotExpiry: {
          lt: now,
        },
      },
      include: { wallet: true },
    });

    // Find expired CJs
    const expiredCJs = await prisma.user.findMany({
      where: {
        role: 'CHIEF_JUDGE',
        cjSlotExpiry: {
          lt: now,
        },
      },
      include: { wallet: true },
    });

    const allExpired = [...expiredLawyers, ...expiredCJs];
    const conversions = [];

    for (const user of allExpired) {
      await prisma.$transaction(async (tx) => {
        // Convert virtual credits to listener credits (1:1 ratio)
        const virtualCredits = user.virtualLawyerCredits || 0;
        
        if (virtualCredits > 0) {
          await tx.user.update({
            where: { id: user.id },
             {
              listenerCredits: {
                increment: virtualCredits,
              },
              virtualLawyerCredits: 0,
            },
          });

          conversions.push({
            userId: user.id,
            virtualCreditsConverted: virtualCredits,
          });
        }

        // Demote to LISTENER
        const updateData: any = {
          role: 'LISTENER',
          virtualLawyerCredits: 0,
        };

        if (user.role === 'LAWYER') {
          updateData.lawyerSlotExpiry = null;
        } else if (user.role === 'CHIEF_JUDGE') {
          updateData.cjSlotExpiry = null;
          updateData.cjSlotReligion = null;
        }

        await tx.user.update({
          where: { id: user.id },
           updateData,
        });

        // Promote next from queue/waitlist
        if (user.role === 'LAWYER') {
          const nextInWaitlist = await tx.lawyerWaitlist.findFirst({
            where: {
              religion: user.religion,
              activatedAt: null,
              paidAt: { not: null },
            },
            orderBy: { position: 'asc' },
          });

          if (nextInWaitlist) {
            const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
            
            await tx.user.update({
              where: { id: nextInWaitlist.userId },
               {
                role: 'LAWYER',
                lawyerSlotExpiry: expiresAt,
              },
            });

            await tx.lawyerWaitlist.update({
              where: { id: nextInWaitlist.id },
               { activatedAt: now },
            });
          }
        } else if (user.role === 'CHIEF_JUDGE') {
          const nextInQueue = await tx.cjQueue.findFirst({
            where: {
              religion: user.cjSlotReligion,
              activatedAt: null,
              paidAt: { not: null },
            },
            orderBy: { position: 'asc' },
          });

          if (nextInQueue) {
            const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
            
            await tx.user.update({
              where: { id: nextInQueue.userId },
               {
                role: 'CHIEF_JUDGE',
                cjSlotReligion: user.cjSlotReligion,
                cjSlotExpiry: expiresAt,
              },
            });

            await tx.cjQueue.update({
              where: { id: nextInQueue.id },
               { activatedAt: now },
            });
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      convertedCount: conversions.length,
      conversions,
    });

  } catch (error) {
    console.error('Tenure end error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

// ═══════════════════════════════════════════════════════
// TRIAL CHECK (daily cron for trial expiry)
// ═══════════════════════════════════════════════════════

export const TRIAL_CHECK_ROUTE = `
// src/app/api/trial/check/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find users with expired trials
    const expiredTrials = await prisma.user.findMany({
      where: {
        trialEndsAt: {
          lt: now,
        },
      },
    });

    const results = [];

    for (const user of expiredTrials) {
      await prisma.user.update({
        where: { id: user.id },
         {
          trialEndsAt: null,
        },
      });

      results.push({
        userId: user.id,
        email: user.email,
        trialEndedAt: user.trialEndsAt,
      });
    }

    return NextResponse.json({
      success: true,
      expiredCount: results.length,
      results,
    });

  } catch (error) {
    console.error('Trial check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

// ═══════════════════════════════════════════════════════
// PAYSTACK INITIALIZATION (with male 2x pricing)
// ═══════════════════════════════════════════════════════

export const PAYSTACK_INIT_WITH_GENDER_ROUTE = `
// src/app/api/paystack/initialize/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Base pricing (female pricing)
const BASE_PACKAGES = {
  COIN_PACK_1: { amount: 100, credits: 200 },
  COIN_PACK_2: { amount: 400, credits: 1000 },
  COIN_PACK_3: { amount: 1000, credits: 3000 },
};

// Male pricing multiplier
const MALE_MULTIPLIER = 2;

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

    if (!packageType || !BASE_PACKAGES[packageType]) {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      );
    }

    // Get user with gender information
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate pricing based on gender
    const basePackage = BASE_PACKAGES[packageType];
    const isMale = user.gender === 'MALE';
    const amount = isMale ? basePackage.amount * MALE_MULTIPLIER : basePackage.amount;
    const credits = basePackage.credits;

    // Convert to kobo (Paystack uses kobo)
    const amountInKobo = amount * 100;

    // Initialize Paystack transaction
    const response = await fetch(\`\${PAYSTACK_BASE_URL}/transaction/initialize\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${PAYSTACK_SECRET_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInKobo,
        currency: 'NGN',
        reference: \`DPC-\${Date.now()}-\${user.id}\`,
        meta {
          custom_fields: [
            {
              display_name: 'Package Type',
              variable_name: 'package_type',
              value: packageType,
            },
            {
              display_name: 'Credits',
              variable_name: 'credits',
              value: credits,
            },
            {
              display_name: 'User ID',
              variable_name: 'user_id',
              value: user.id,
            },
            {
              display_name: 'Gender',
              variable_name: 'gender',
              value: user.gender,
            },
            {
              display_name: 'Is Male Pricing',
              variable_name: 'is_male_pricing',
              value: isMale.toString(),
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
      amount,
      credits,
      isMalePricing: isMale,
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
