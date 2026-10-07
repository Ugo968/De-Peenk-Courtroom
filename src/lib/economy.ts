/**
 * De Peenk Courtroom - Economy & Payment Types
 * 
 * COINS SYSTEM:
 * - Coins are used for all platform transactions
 * - File a case: 200 coins
 * - Hire a lawyer: 500 coins
 * - Testify/object: 200 coins
 */

export type PackageType = 'COIN_PACK_1' | 'COIN_PACK_2' | 'COIN_PACK_3' | 'CJ_SEAT';

export interface CreditPackage {
  id: PackageType;
  label: string;
  amountNaira: number;
  credits: number;
  emoji: string;
  description: string;
  color: 'pink' | 'sky' | 'gold';
  badge?: string;
  duration?: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'COIN_PACK_1',
    label: 'Coin Pack 1',
    amountNaira: 100,
    credits: 200,
    emoji: '💰',
    description: 'Starter pack for basic platform activities',
    color: 'pink',
  },
  {
    id: 'COIN_PACK_2',
    label: 'Coin Pack 2',
    amountNaira: 400,
    credits: 1000,
    emoji: '💎',
    description: 'Better value for active users',
    color: 'sky',
    badge: 'Popular',
  },
  {
    id: 'COIN_PACK_3',
    label: 'Coin Pack 3',
    amountNaira: 1000,
    credits: 3000,
    emoji: '👑',
    description: 'Best value for power users',
    color: 'gold',
    badge: 'Best Value',
  },
  {
    id: 'CJ_SEAT',
    label: 'Chief Judge Seat',
    amountNaira: 3500,
    credits: 0,
    emoji: '👑',
    description: 'Grants access to the CJ dashboard for 2 weeks. Preside over cases!',
    color: 'gold',
    badge: 'Premium',
    duration: '2 weeks',
  },
];

/**
 * Coin costs for platform actions
 */
export const COIN_COSTS = {
  FILE_CASE: 200,
  HIRE_LAWYER: 500,
  TESTIFY: 200,
  OBJECT: 200,
};

/**
 * Virtual Lawyer Reward Constants (Gamified, NOT real money)
 */
export const VIRTUAL_REWARDS = {
  CREDITS_PER_WIN: 400,
  CASES_WON_INCREMENT: 1,
  LEVEL_THRESHOLD: 1000, // credits per level
};

export interface WalletState {
  balanceCredits: number;
  virtualLawyerCredits: number;
  casesWon: number;
  level: number;
}
