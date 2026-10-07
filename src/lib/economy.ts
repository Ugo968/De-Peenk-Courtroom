/**
 * De Peenk Courtroom - Economy & Payment Types
 */

export type PackageType = 'LISTENER' | 'LAWYER' | 'TESTIFIER' | 'PLAINTIFF_FILING' | 'CJ_SEAT';

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
    id: 'LISTENER',
    label: 'Listener Pack',
    amountNaira: 1000,
    credits: 10000,
    emoji: '💖',
    description: 'Perfect for active floor members who want to testify and support',
    color: 'pink',
    badge: 'Popular',
  },
  {
    id: 'LAWYER',
    label: 'Lawyer Pack',
    amountNaira: 2000,
    credits: 30000,
    emoji: '⚖️',
    description: 'For legal advocates who want maximum influence in the courtroom',
    color: 'sky',
    badge: 'Best Value',
  },
  {
    id: 'TESTIFIER',
    label: 'Testifier Pack',
    amountNaira: 150,
    credits: 500,
    emoji: '💬',
    description: 'Used to formally testify or object in active cases',
    color: 'pink',
  },
  {
    id: 'PLAINTIFF_FILING',
    label: 'Plaintiff Filing',
    amountNaira: 100,
    credits: 500,
    emoji: '🎀',
    description: 'Required to open a new case in the courtroom',
    color: 'sky',
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
