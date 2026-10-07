/**
 * De Peenk Courtroom - Ad Management System
 * 
 * Ad Types & Pricing (6-day duration):
 * - Flyer (Sidebar): ₦2,000
 * - Poster (Banner Area): ₦5,000
 * - Banner/Flag (Header/Footer Sticky): ₦8,000
 * - Billboard (Inside CJ Chamber): ₦12,000
 * - Video (Pop-ups): ₦15,000
 */

export type AdTier = 'FLYER' | 'POSTER' | 'BANNER' | 'BILLBOARD' | 'VIDEO';

export interface AdPackage {
  id: AdTier;
  label: string;
  amountNaira: number;
  duration: string;
  position: string;
  emoji: string;
  description: string;
  color: 'pink' | 'sky' | 'gold' | 'purple';
  badge?: string;
}

export interface Ad {
  id: string;
  brandName: string;
  tier: AdTier;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
}

export const AD_PACKAGES: AdPackage[] = [
  {
    id: 'FLYER',
    label: 'Flyer',
    amountNaira: 2000,
    duration: '6 days',
    position: 'Sidebar',
    emoji: '📄',
    description: 'Small sidebar ad visible on all pages. Perfect for brand awareness.',
    color: 'pink',
  },
  {
    id: 'POSTER',
    label: 'Poster',
    amountNaira: 5000,
    duration: '6 days',
    position: 'Banner Area',
    emoji: '🖼️',
    description: 'Medium-sized banner displayed in the content area. Great visibility.',
    color: 'sky',
    badge: 'Popular',
  },
  {
    id: 'BANNER',
    label: 'Banner/Flag',
    amountNaira: 8000,
    duration: '6 days',
    position: 'Header/Footer Sticky',
    emoji: '🚩',
    description: 'Sticky banner at top or bottom of every page. Maximum exposure.',
    color: 'gold',
    badge: 'High Impact',
  },
  {
    id: 'BILLBOARD',
    label: 'Billboard',
    amountNaira: 12000,
    duration: '6 days',
    position: "Chief Judge's Chamber",
    emoji: '🏛️',
    description: 'Premium placement inside the exclusive CJ Chamber. Elite audience.',
    color: 'gold',
    badge: 'Premium',
  },
  {
    id: 'VIDEO',
    label: 'Video Ad',
    amountNaira: 15000,
    duration: '6 days',
    position: 'Pop-up Modal',
    emoji: '🎬',
    description: 'Video pop-up ad shown to users. Highest engagement rate.',
    color: 'purple',
    badge: 'Maximum Reach',
  },
];

export const AD_DURATION_MS = 6 * 24 * 60 * 60 * 1000; // 6 days in milliseconds

/**
 * Mock ads for demo purposes
 */
export const mockAds: Ad[] = [
  {
    id: 'ad-1',
    brandName: 'GlowBeauty NG',
    tier: 'BANNER',
    title: '✨ Glow Beauty - Feel Like Royalty',
    content: 'Premium skincare for the modern Nigerian woman. Use code PEEINK20 for 20% off!',
    imageUrl: 'https://via.placeholder.com/1200x100/FFD1DC/C71585?text=Glow+Beauty+NG',
    linkUrl: 'https://example.com/glowbeauty',
    isActive: true,
    startsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ad-2',
    brandName: 'SistaLaw Firm',
    tier: 'FLYER',
    title: 'Free Legal Consultation',
    content: 'First consultation free for De Peenk members. Call 0801-PEEINK',
    imageUrl: 'https://via.placeholder.com/300x250/E0F6FF/007399?text=SistaLaw',
    linkUrl: 'https://example.com/sistalaw',
    isActive: true,
    startsAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ad-3',
    brandName: 'Crown Wellness Spa',
    tier: 'BILLBOARD',
    title: '👑 You Deserve Royal Treatment',
    content: 'Luxury spa packages starting at ₦25,000. Book your escape today.',
    imageUrl: 'https://via.placeholder.com/600x400/FFF3B0/B39700?text=Crown+Wellness',
    linkUrl: 'https://example.com/crownwellness',
    isActive: true,
    startsAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ad-4',
    brandName: 'Naija Fashion House',
    tier: 'POSTER',
    title: '🎀 Elegant Styles for Every Occasion',
    content: 'Custom designs from ₦15,000. Look stunning in De Peenk approved styles.',
    imageUrl: 'https://via.placeholder.com/800x200/FFD1DC/C71585?text=Naija+Fashion',
    linkUrl: 'https://example.com/naijafashion',
    isActive: true,
    startsAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Filter active, non-expired ads by tier
 */
export function getActiveAds(tier?: AdTier): Ad[] {
  const now = new Date();
  return mockAds.filter((ad) => {
    const isActive = ad.isActive;
    const notExpired = new Date(ad.expiresAt) > now;
    const hasStarted = new Date(ad.startsAt) <= now;
    const matchesTier = !tier || ad.tier === tier;
    return isActive && notExpired && hasStarted && matchesTier;
  });
}

/**
 * Calculate days remaining for an ad
 */
export function getDaysRemaining(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}
