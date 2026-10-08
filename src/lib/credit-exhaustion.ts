/**
 * De Peenk Courtroom - Credit Exhaustion System
 * 
 * Manages three types of credits:
 * 1. Listener Credits - Earned via purchase/ad videos
 * 2. Coins - Used for active courtroom participation
 * 3. Virtual Lawyer/CJ Credits - Gamified, fake credits
 */

// ============ CREDIT COSTS ============

export const LISTENER_CREDIT_COSTS = {
  VIRTUAL_GIFT: 50,
  BOOST_COMMENT: 100,
  UNLOCK_ARCHIVED_CASE: 25,
  CASE_OUTCOME_POLL: 10,
  STAR_LISTENER_BADGE: 200,
};

export const COIN_COSTS = {
  FILE_CASE: 200,
  HIRE_LAWYER: 500,
  TESTIFY: 200,
  OBJECT: 100,
  EXPEDITED_REVIEW: 1000,
};

export const VIRTUAL_CREDIT_REWARDS = {
  LAWYER_WINS_CASE: 4000,
  CJ_RESOLVES_CASE: 6000,
};

export const DAILY_REWARDS = {
  DAILY_LOGIN: 10,
  SEVEN_DAY_STREAK_BONUS: 100,
  REFERRAL_BONUS: 200,
};

// ============ EXHAUSTION THRESHOLDS ============

export const EXHAUSTION_THRESHOLDS = {
  LOW_BALANCE_WARNING: 50,
  ZERO_BALANCE_BLOCK: 0,
};

// ============ INTERFACES ============

export interface CreditBalance {
  listenerCredits: number;
  coins: number;
  virtualCredits: number;
}

export interface ExhaustionNotice {
  type: 'LOW_BALANCE' | 'ZERO_BALANCE' | 'INFO';
  message: string;
  emoji: string;
  showRechargeModal: boolean;
}

export interface DailyStreak {
  currentStreak: number;
  lastLoginDate: string;
  totalLogins: number;
  bonusClaimed: boolean;
}

// ============ HELPER FUNCTIONS ============

/**
 * Check if user has sufficient credits for an action
 */
export function hasSufficientCredits(
  balance: CreditBalance,
  creditType: 'listenerCredits' | 'coins' | 'virtualCredits',
  amount: number
): boolean {
  return balance[creditType] >= amount;
}

/**
 * Get exhaustion notice based on balance
 */
export function getExhaustionNotice(
  balance: CreditBalance,
  creditType: 'listenerCredits' | 'coins'
): ExhaustionNotice | null {
  const currentBalance = balance[creditType];
  
  if (currentBalance === 0) {
    return {
      type: 'ZERO_BALANCE',
      message: 'Your balance is empty, darling. Time to recharge!',
      emoji: '💔',
      showRechargeModal: true,
    };
  }
  
  if (currentBalance < EXHAUSTION_THRESHOLDS.LOW_BALANCE_WARNING) {
    return {
      type: 'LOW_BALANCE',
      message: 'Your balance is running low, darling',
      emoji: '💕',
      showRechargeModal: false,
    };
  }
  
  return null;
}

/**
 * Check if action is free (no cost)
 */
export function isFreeAction(action: string): boolean {
  const freeActions = [
    'BROWSE_CASES',
    'READ_TESTIMONIES',
    'WATCH_GALLERY_TALK',
    'VIEW_PROFILES',
    'WATCH_VIDEO_ADS',
  ];
  return freeActions.includes(action);
}

/**
 * Calculate daily login reward
 */
export function calculateDailyLoginReward(streak: DailyStreak): {
  reward: number;
  isStreakBonus: boolean;
  newStreak: number;
} {
  const today = new Date().toDateString();
  const lastLogin = new Date(streak.lastLoginDate).toDateString();
  
  // Check if already logged in today
  if (today === lastLogin) {
    return {
      reward: 0,
      isStreakBonus: false,
      newStreak: streak.currentStreak,
    };
  }
  
  // Check if consecutive day
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isConsecutive = new Date(streak.lastLoginDate).toDateString() === yesterday.toDateString();
  
  const newStreak = isConsecutive ? streak.currentStreak + 1 : 1;
  const isStreakBonus = newStreak === 7;
  const reward = DAILY_REWARDS.DAILY_LOGIN + (isStreakBonus ? DAILY_REWARDS.SEVEN_DAY_STREAK_BONUS : 0);
  
  return {
    reward,
    isStreakBonus,
    newStreak,
  };
}

/**
 * Get action cost and description
 */
export function getActionDetails(action: string): {
  cost: number;
  creditType: 'listenerCredits' | 'coins';
  description: string;
  emoji: string;
} | null {
  const actions: Record<string, any> = {
    // Listener Credit Actions
    VIRTUAL_GIFT: {
      cost: LISTENER_CREDIT_COSTS.VIRTUAL_GIFT,
      creditType: 'listenerCredits',
      description: 'Send a virtual gift to show support',
      emoji: '🎁',
    },
    BOOST_COMMENT: {
      cost: LISTENER_CREDIT_COSTS.BOOST_COMMENT,
      creditType: 'listenerCredits',
      description: 'Boost your comment (pinned for 1 hour)',
      emoji: '📌',
    },
    UNLOCK_ARCHIVED_CASE: {
      cost: LISTENER_CREDIT_COSTS.UNLOCK_ARCHIVED_CASE,
      creditType: 'listenerCredits',
      description: 'Unlock archived case to read judgment',
      emoji: '🔓',
    },
    CASE_OUTCOME_POLL: {
      cost: LISTENER_CREDIT_COSTS.CASE_OUTCOME_POLL,
      creditType: 'listenerCredits',
      description: 'Vote in case outcome poll',
      emoji: '📊',
    },
    STAR_LISTENER_BADGE: {
      cost: LISTENER_CREDIT_COSTS.STAR_LISTENER_BADGE,
      creditType: 'listenerCredits',
      description: 'Get Star Listener badge for 24h',
      emoji: '⭐',
    },
    
    // Coin Actions
    FILE_CASE: {
      cost: COIN_COSTS.FILE_CASE,
      creditType: 'coins',
      description: 'File a new case',
      emoji: '📝',
    },
    HIRE_LAWYER: {
      cost: COIN_COSTS.HIRE_LAWYER,
      creditType: 'coins',
      description: 'Hire a specific lawyer',
      emoji: '⚖️',
    },
    TESTIFY: {
      cost: COIN_COSTS.TESTIFY,
      creditType: 'coins',
      description: 'Testify as a witness',
      emoji: '🗣️',
    },
    OBJECT: {
      cost: COIN_COSTS.OBJECT,
      creditType: 'coins',
      description: 'Object to testimony',
      emoji: '🚫',
    },
    EXPEDITED_REVIEW: {
      cost: COIN_COSTS.EXPEDITED_REVIEW,
      creditType: 'coins',
      description: 'Request expedited case review',
      emoji: '⚡',
    },
  };
  
  return actions[action] || null;
}

/**
 * Format credit display with emoji
 */
export function formatCreditDisplay(
  amount: number,
  creditType: 'listenerCredits' | 'coins' | 'virtualCredits'
): string {
  const emojis = {
    listenerCredits: '💎',
    coins: '💰',
    virtualCredits: '⚖️',
  };
  
  return `${emojis[creditType]} ${amount.toLocaleString()}`;
}
