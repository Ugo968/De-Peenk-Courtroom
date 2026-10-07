/**
 * Ad Video Rewards API Routes
 * 
 * Handles video watching, credit rewards, and tenure-end credit conversion
 */

export const VIDEO_REWARD_WATCH_ROUTE = `
// src/app/api/ad-video-rewards/watch/route.ts

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
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

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
          maxVideosPerDay: MAX_VIDEOS_PER_DAY,
        },
        { status: 429 }
      );
    }

    // Atomic transaction: increment video count and award credits
    const result = await prisma.$transaction(async (tx) => {
      // Increment video count
      await tx.adVideoView.update({
        where: { id: videoView!.id },
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

      // Get updated wallet
      const updatedWallet = await tx.wallet.findUnique({
        where: { userId: user.id },
      });

      return {
        videosWatchedToday: videoView!.count + 1,
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

export const VIDEO_REWARD_STATUS_ROUTE = `
// src/app/api/ad-video-rewards/status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MAX_VIDEOS_PER_DAY = 20;
const CREDITS_PER_VIDEO = 10;

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

    // Check if user is exempt (Lawyer or CJ)
    const isExempt = user.role === 'LAWYER' || user.role === 'CHIEF_JUDGE';

    // Get today's video view count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const videoView = await prisma.adVideoView.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
    });

    const videosWatchedToday = videoView?.count || 0;
    const canWatch = !isExempt && videosWatchedToday < MAX_VIDEOS_PER_DAY;

    // Calculate next reset time (midnight)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return NextResponse.json({
      canWatch,
      isExempt,
      videosWatchedToday,
      maxVideosPerDay: MAX_VIDEOS_PER_DAY,
      creditsEarnedToday: videosWatchedToday * CREDITS_PER_VIDEO,
      nextResetTime: tomorrow.toISOString(),
    });

  } catch (error) {
    console.error('Video status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

export const TENURE_END_CREDIT_CONVERSION_ROUTE = `
// src/app/api/cron/tenure-end-credit-conversion/route.ts
// Cron job to convert virtual lawyer credits to listener credits at tenure end
// Run every hour via Vercel Cron or similar

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      include: {
        wallet: true,
      },
    });

    // Find expired CJ slots
    const expiredCJs = await prisma.user.findMany({
      where: {
        role: 'CHIEF_JUDGE',
        cjSlotExpiry: {
          lt: now,
        },
      },
      include: {
        wallet: true,
      },
    });

    const allExpired = [...expiredLawyers, ...expiredCJs];
    const conversions = [];

    for (const user of allExpired) {
      await prisma.$transaction(async (tx) => {
        // Convert virtual lawyer credits to listener credits (1:1 ratio)
        const virtualCredits = user.virtualLawyerCredits || 0;
        
        if (virtualCredits > 0 && user.wallet) {
          // Add virtual credits to wallet balance
          await tx.wallet.update({
            where: { userId: user.id },
             {
              balance: {
                increment: virtualCredits,
              },
            },
          });

          conversions.push({
            userId: user.id,
            virtualCreditsConverted: virtualCredits,
            previousBalance: user.wallet.balance,
            newBalance: user.wallet.balance + virtualCredits,
          });
        }

        // Reset virtual credits
        await tx.user.update({
          where: { id: user.id },
           {
            virtualLawyerCredits: 0,
          },
        });

        // Demote to LISTENER
        const updateData: any = {
          role: 'LISTENER',
        };

        if (user.role === 'LAWYER') {
          updateData.lawyerSlotExpiry = null;
        } else if (user.role === 'CHIEF_JUDGE') {
          updateData.cjSlotExpiry = null;
          updateData.cjSlotReligion = null;
        }

        await tx.user.update({
          where: { id: user.id },
          data: updateData,
        });
      });
    }

    return NextResponse.json({
      message: 'Tenure-end credit conversion completed',
      convertedCount: conversions.length,
      conversions,
    });

  } catch (error) {
    console.error('Credit conversion cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    );
  }
}
`;

export const VIDEO_REWARD_SCHEMA_ADDITIONS = `
// Add to prisma/schema.prisma

// New AdVideoView model
model AdVideoView {
  id        String   @id @default(cuid())
  userId    String
  date      DateTime @db.Date
  count     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id])
  
  @@unique([userId, date])
  @@index([userId, date])
}

// Add to User model
model User {
  // ... existing fields ...
  
  adVideoViews AdVideoView[]
}
`;
