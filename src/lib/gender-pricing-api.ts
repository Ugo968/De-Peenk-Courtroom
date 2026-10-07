/**
 * Gender-Based Pricing API Routes
 * 
 * These routes enforce gender-based restrictions at the API level:
 * - Males pay DOUBLE for credits
 * - Males cannot become lawyers or chief judges
 * - Males cannot file cases
 */

export const GENDER_PRICING_API_ROUTES = `
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

// src/app/api/lawyer-slots/purchase/route.ts

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
        { 
          error: 'Only women can become lawyers on De Peenk Courtroom.',
          message: 'Gentlemen are welcome as listeners and witnesses. This platform is dedicated to women\\'s justice.'
        },
        { status: 403 }
      );
    }

    // Continue with lawyer slot purchase logic...
    // ... rest of the code

  } catch (error) {
    console.error('Lawyer slot purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// src/app/api/cj-slots/purchase/route.ts

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

    // CRITICAL: Gender validation - only females can become chief judges
    if (user.gender !== 'FEMALE') {
      return NextResponse.json(
        { 
          error: 'Only women can become Chief Judges on De Peenk Courtroom.',
          message: 'Gentlemen are welcome as listeners and witnesses. This platform is dedicated to women\\'s justice.'
        },
        { status: 403 }
      );
    }

    // Continue with CJ slot purchase logic...
    // ... rest of the code

  } catch (error) {
    console.error('CJ slot purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// src/app/api/cases/file/route.ts

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

    // Get user
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

    // CRITICAL: Gender validation - only females can file cases
    if (user.gender !== 'FEMALE') {
      return NextResponse.json(
        { 
          error: 'Only women can file cases on De Peenk Courtroom.',
          message: 'This is a safe space for women to seek justice. Gentlemen can participate as listeners and witnesses.'
        },
        { status: 403 }
      );
    }

    // Continue with case filing logic...
    // ... rest of the code

  } catch (error) {
    console.error('Case filing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;
