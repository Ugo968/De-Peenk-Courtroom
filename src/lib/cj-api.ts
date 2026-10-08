/**
 * Chief Judge API Routes - De Peenk Courtroom
 * 
 * CJ Triage & Ruling System
 */

export const CJ_ACTION_ROUTE = `
// src/app/api/cases/[id]/cj-action/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const { action } = await req.json();

    // Validate action
    if (!['HANDLE_MYSELF', 'ASSIGN_TO_LAWYERS'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get the Chief Judge
    const cj = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!cj || cj.role !== 'CHIEF_JUDGE') {
      return NextResponse.json(
        { error: 'Only Chief Judges can perform this action' },
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

    // Verify case is in CJ_REVIEW status
    if (caseData.status !== 'CJ_REVIEW') {
      return NextResponse.json(
        { error: 'Case is not in CJ review queue' },
        { status: 400 }
      );
    }

    // Update case based on action
    let newStatus: 'CJ_HANDLING' | 'CJ_ASSIGNED';
    
    if (action === 'HANDLE_MYSELF') {
      newStatus = 'CJ_HANDLING';
    } else {
      newStatus = 'CJ_ASSIGNED';
    }

    const updatedCase = await prisma.case.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        judgeId: action === 'HANDLE_MYSELF' ? cj.id : null,
      },
    });

    return NextResponse.json({
      success: true,
      case: updatedCase,
      message: action === 'HANDLE_MYSELF'
        ? 'Case assigned to you. Proceed to your Private Chamber.'
        : 'Case assigned to Lawyers queue.',
    });

  } catch (error) {
    console.error('CJ action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

export const CJ_RULING_ROUTE = `
// src/app/api/cases/[id]/cj-ruling/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const { ruling } = await req.json();

    if (!ruling || ruling.trim().length === 0) {
      return NextResponse.json(
        { error: 'Ruling is required' },
        { status: 400 }
      );
    }

    // Get the Chief Judge
    const cj = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!cj || cj.role !== 'CHIEF_JUDGE') {
      return NextResponse.json(
        { error: 'Only Chief Judges can deliver rulings' },
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

    // Verify case is in CJ_HANDLING status
    if (caseData.status !== 'CJ_HANDLING') {
      return NextResponse.json(
        { error: 'Case is not being handled by you' },
        { status: 400 }
      );
    }

    // Verify CJ is the assigned judge
    if (caseData.judgeId !== cj.id) {
      return NextResponse.json(
        { error: 'You are not assigned to this case' },
        { status: 403 }
      );
    }

    // Atomic transaction: resolve case
    const resolvedCase = await prisma.$transaction(async (tx) => {
      // Update case to RESOLVED
      const updatedCase = await tx.case.update({
        where: { id: params.id },
        data: {
          status: 'RESOLVED',
          verdict: ruling.trim(),
          resolvedAt: new Date(),
        },
      });

      // Reward CJ with virtual credits (same as lawyers)
      await tx.user.update({
        where: { id: cj.id },
        data: {
          virtualLawyerCredits: {
            increment: 400,
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
      message: 'Ruling delivered successfully. Case resolved.',
      rewards: {
        virtualCreditsEarned: 400,
      },
    });

  } catch (error) {
    console.error('CJ ruling error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;
