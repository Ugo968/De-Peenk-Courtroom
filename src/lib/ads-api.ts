/**
 * Ad Management API Routes - De Peenk Courtroom
 * 
 * Brands buy ads that run for exactly 6 days, then auto-expire.
 */

export const AD_INITIALIZE_ROUTE = `
// src/app/api/ads/initialize/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Ad pricing in Naira
const AD_PRICING = {
  FLYER: 2000,
  POSTER: 5000,
  BANNER: 8000,
  BILLBOARD: 12000,
  VIDEO: 15000,
};

const AD_DURATION_DAYS = 6;

export async function POST(req: NextRequest) {
  try {
    const { brandName, tier, title, content, imageUrl, videoUrl, linkUrl, brandEmail } = await req.json();

    // Validate tier
    if (!tier || !AD_PRICING[tier]) {
      return NextResponse.json(
        { error: 'Invalid ad tier' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!brandName || !title || !content || !brandEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const amountNaira = AD_PRICING[tier];
    const amountInKobo = amountNaira * 100;

    // Calculate expiry date (6 days from now)
    const expiresAt = new Date(Date.now() + AD_DURATION_DAYS * 24 * 60 * 60 * 1000);

    // Initialize Paystack transaction
    const response = await fetch(\`\${PAYSTACK_BASE_URL}/transaction/initialize\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${PAYSTACK_SECRET_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: brandEmail,
        amount: amountInKobo,
        currency: 'NGN',
        reference: \`AD-\${Date.now()}-\${tier}\`,
        metadata: {
          custom_fields: [
            { display_name: 'Ad Type', variable_name: 'ad_type', value: 'AD_PURCHASE' },
            { display_name: 'Tier', variable_name: 'tier', value: tier },
            { display_name: 'Brand Name', variable_name: 'brand_name', value: brandName },
            { display_name: 'Title', variable_name: 'title', value: title },
            { display_name: 'Content', variable_name: 'content', value: content },
            { display_name: 'Image URL', variable_name: 'image_url', value: imageUrl || '' },
            { display_name: 'Video URL', variable_name: 'video_url', value: videoUrl || '' },
            { display_name: 'Link URL', variable_name: 'link_url', value: linkUrl || '' },
            { display_name: 'Expires At', variable_name: 'expires_at', value: expiresAt.toISOString() },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || 'Failed to initialize ad transaction' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      accessCode: data.data.access_code,
      amount: amountNaira,
      duration: \`\${AD_DURATION_DAYS} days\`,
      expiresAt: expiresAt.toISOString(),
    });

  } catch (error) {
    console.error('Ad initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

export const AD_WEBHOOK_ROUTE = `
// src/app/api/ads/webhook/route.ts

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
    const adType = customFields.find(f => f.variable_name === 'ad_type')?.value;
    
    if (adType !== 'AD_PURCHASE') {
      return NextResponse.json({ message: 'Not an ad purchase' });
    }

    const tier = customFields.find(f => f.variable_name === 'tier')?.value;
    const brandName = customFields.find(f => f.variable_name === 'brand_name')?.value;
    const title = customFields.find(f => f.variable_name === 'title')?.value;
    const content = customFields.find(f => f.variable_name === 'content')?.value;
    const imageUrl = customFields.find(f => f.variable_name === 'image_url')?.value;
    const videoUrl = customFields.find(f => f.variable_name === 'video_url')?.value;
    const linkUrl = customFields.find(f => f.variable_name === 'link_url')?.value;
    const expiresAt = customFields.find(f => f.variable_name === 'expires_at')?.value;

    // Create the Ad record
    await prisma.ad.create({
       {
        brandName,
        tier,
        title,
        content,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        linkUrl: linkUrl || null,
        isActive: true,
        startsAt: new Date(),
        expiresAt: new Date(expiresAt),
      },
    });

    return NextResponse.json({ message: 'Ad created successfully' });

  } catch (error) {
    console.error('Ad webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
`;
