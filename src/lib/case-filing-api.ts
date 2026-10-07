/**
 * Case Filing API Route - De Peenk Courtroom
 * 
 * CRITICAL ROUTING LOGIC:
 * - RELATIONSHIPS category → CJ_REVIEW (bypasses lawyers, goes to Chief Judge)
 * - ALL OTHER categories → OPEN (goes directly to Lawyers queue)
 */

export const CASE_FILING_ROUTE = `
// src/app/api/cases/file/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const FILING_COST = 300; // Credits required to file a case

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, category } = await req.json();

    // Validate input
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = [
      'RELATIONSHIPS', 'MARRIAGE', 'FAMILY', 
      'GIRL_SAFETY', 'EDUCATION_CAREER', 'MOTHERHOOD', 'OTHERS'
    ];
    
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Get user and wallet
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

    // Check if user has enough credits
    if (!user.wallet || user.wallet.balance < FILING_COST) {
      return NextResponse.json(
        { 
          error: 'Insufficient credits',
          required: FILING_COST,
          current: user.wallet?.balance || 0
        },
        { status: 402 }
      );
    }

    // CRITICAL ROUTING LOGIC
    let status: 'CJ_REVIEW' | 'OPEN';
    
    if (category === 'RELATIONSHIPS') {
      // RELATIONSHIPS bypass lawyers, go straight to Chief Judge
      status = 'CJ_REVIEW';
    } else {
      // All other categories go to Lawyers queue
      status = 'OPEN';
    }

    // Atomic transaction: deduct credits and create case
    const newCase = await prisma.$transaction(async (tx) => {
      // Deduct filing credits
      await tx.wallet.update({
        where: { userId: user.id },
         {
          balance: {
            decrement: FILING_COST,
          },
        },
      });

      // Create the case
      const createdCase = await tx.case.create({
         {
          title,
          description,
          category,
          status,
          plaintiffId: user.id,
        },
      });

      // Increment user's cases filed counter
      await tx.user.update({
        where: { id: user.id },
         {
          casesFiled: {
            increment: 1,
          },
        },
      });

      return createdCase;
    });

    return NextResponse.json({
      success: true,
      case: newCase,
      creditsDeducted: FILING_COST,
      routingNote: category === 'RELATIONSHIPS' 
        ? 'This case has been routed to the Chief Judge for review'
        : 'This case is now open for lawyers to handle',
    });

  } catch (error) {
    console.error('Case filing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;
