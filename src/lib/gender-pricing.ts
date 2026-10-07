/**
 * De Peenk Courtroom - Gender-Based Pricing System
 * 
 * RULES:
 * - Males pay DOUBLE for listener credits (same credits, 2x price)
 * - Males CANNOT: Become Lawyers, Become Chief Judges, File cases
 * - Males CAN: Be Listeners, Buy coins to testify as witnesses
 */

import type { Gender } from './lawyer-slots';

export interface PricingTier {
  id: string;
  label: string;
  basePriceNaira: number;
  malePriceNaira: number;
  credits: number;
  emoji: string;
  description: string;
  color: 'pink' | 'sky' | 'gold';
  badge?: string;
  duration?: string;
}

/**
 * Get pricing for a user based on gender
 */
export function getPricingForUser(gender: Gender): PricingTier[] {
  const isMale = gender === 'MALE';
  
  return [
    {
      id: 'COIN_PACK_1',
      label: isMale ? "Gentleman's Pack 1" : 'Coin Pack 1',
      basePriceNaira: 100,
      malePriceNaira: 200,
      credits: 200,
      emoji: '💰',
      description: isMale 
        ? "Gentleman's rate - supports the sisterhood 💖" 
        : 'Starter pack for basic platform activities',
      color: 'pink',
    },
    {
      id: 'COIN_PACK_2',
      label: isMale ? "Gentleman's Pack 2" : 'Coin Pack 2',
      basePriceNaira: 400,
      malePriceNaira: 800,
      credits: 1000,
      emoji: '💎',
      description: isMale 
        ? "Gentleman's rate - supports the sisterhood 💖" 
        : 'Better value for active users',
      color: 'sky',
      badge: isMale ? undefined : 'Popular',
    },
    {
      id: 'COIN_PACK_3',
      label: isMale ? "Gentleman's Pack 3" : 'Coin Pack 3',
      basePriceNaira: 1000,
      malePriceNaira: 2000,
      credits: 3000,
      emoji: '👑',
      description: isMale 
        ? "Gentleman's rate - supports the sisterhood 💖" 
        : 'Best value for power users',
      color: 'gold',
      badge: isMale ? undefined : 'Best Value',
    },
  ];
}

/**
 * Get the price for a specific package based on gender
 */
export function getPackagePrice(packageId: string, gender: Gender): number {
  const packages = getPricingForUser(gender);
  const pkg = packages.find(p => p.id === packageId);
  
  if (!pkg) return 0;
  
  return gender === 'MALE' ? pkg.malePriceNaira : pkg.basePriceNaira;
}

/**
 * Check if user can perform an action based on gender
 */
export function canPerformAction(
  action: 'FILE_CASE' | 'BECOME_LAWYER' | 'BECOME_CJ' | 'TESTIFY' | 'WATCH_VIDEO',
  gender: Gender
): { allowed: boolean; message?: string } {
  if (gender === 'MALE') {
    switch (action) {
      case 'FILE_CASE':
        return {
          allowed: false,
          message: 'Only women can file cases on De Peenk Courtroom. This is a safe space for women to seek justice.',
        };
      case 'BECOME_LAWYER':
        return {
          allowed: false,
          message: 'Only women can become lawyers on De Peenk Courtroom. Gentlemen are welcome as listeners and witnesses.',
        };
      case 'BECOME_CJ':
        return {
          allowed: false,
          message: 'Only women can become Chief Judges on De Peenk Courtroom. Gentlemen are welcome as listeners and witnesses.',
        };
      case 'TESTIFY':
        return {
          allowed: true,
          message: 'Gentlemen can testify as witnesses in cases.',
        };
      case 'WATCH_VIDEO':
        return {
          allowed: true,
          message: 'Gentlemen can watch videos to earn coins.',
        };
    }
  }
  
  // Females can do everything
  return { allowed: true };
}

/**
 * Calculate male pricing multiplier
 */
export const MALE_PRICING_MULTIPLIER = 2;

/**
 * Format price display with male notice
 */
export function formatPriceDisplay(
  basePrice: number,
  gender: Gender
): { price: number; notice?: string } {
  if (gender === 'MALE') {
    return {
      price: basePrice * MALE_PRICING_MULTIPLIER,
      notice: "Gentleman's rate - supports the sisterhood 💖",
    };
  }
  
  return { price: basePrice };
}
