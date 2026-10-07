/**
 * Case Resolve API Route - De Peenk Courtroom
 * 
 * When a lawyer submits a final verdict:
 * 1. Updates case status to RESOLVED
 * 2. Adds 400 to lawyer's virtualLawyerCredits (gamified, NOT real money)
 * 3. Increments lawyer's casesWon counter
 */

export const CASE_RESOLVE_ROUTE = `
// src/app/api/cases/[id]/resolve/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VIRTUAL_CREDITS_PER_WIN = 400;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { verdict } = await req.json();

    if (!verdict || verdict.trim().length === 0) {
      return NextResponse.json(
        { error: 'Verdict is required' },
        { status: 400 }
      );
    }

    // Get the lawyer
    const lawyer = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!lawyer) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify user is a lawyer
    if (lawyer.role !== 'LAWYER') {
      return NextResponse.json(
        { error: 'Only lawyers can resolve cases' },
        { status: 403 }
      );
    }

    // Get the case
    const caseData = await prisma.case.findUnique({
      where: { id: params.id },
    });

    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Verify case is in a resolvable state
    const resolvableStatuses = ['OPEN', 'CJ_ASSIGNED', 'CJ_HANDLING', 'DELIBERATING'];
    if (!resolvableStatuses.includes(caseData.status)) {
      return NextResponse.json(
        { error: 'Case cannot be resolved in its current state' },
        { status: 400 }
      );
    }

    // Atomic transaction: resolve case and reward lawyer
    const resolvedCase = await prisma.$transaction(async (tx) => {
      // Update case to RESOLVED
      const updatedCase = await tx.case.update({
        where: { id: params.id },
         {
          status: 'RESOLVED',
          verdict: verdict.trim(),
          resolvedAt: new Date(),
          judgeId: lawyer.id,
        },
      });

      // Reward the lawyer with virtual credits (GAMIFIED - NOT real money)
      await tx.user.update({
        where: { id: lawyer.id },
         {
          virtualLawyerCredits: {
            increment: VIRTUAL_CREDITS_PER_WIN,
          },
          casesWon: {
            increment: 1,
          },
        },
      });

      return updatedCase;
    });

    return NextResponse.json({
      success: true,
      case: resolvedCase,
      rewards: {
        virtualCreditsEarned: VIRTUAL_CREDITS_PER_WIN,
        message: 'Congratulations! You earned 400 virtual lawyer credits!',
      },
    });

  } catch (error) {
    console.error('Case resolve error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;
