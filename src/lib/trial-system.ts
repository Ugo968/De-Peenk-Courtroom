/**
 * De Peenk Courtroom - Free Trial System
 * 
 * RULES:
 * - Every new user gets a 3-day free trial
 * - On signup: 100 listener credits (50 for males) + 50 coins
 * - After 3 days, features lock behind paywall
 * - Cron job downgrades expired trial users
 */

export const TRIAL_DURATION_DAYS = 3;
export const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

export interface TrialInfo {
  isActive: boolean;
  endsAt: string | null;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  totalSecondsRemaining: number;
  isExpired: boolean;
}

/**
 * Calculate trial end date (3 days from now)
 */
export function calculateTrialEndDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + TRIAL_DURATION_MS);
}

/**
 * Get initial trial credits based on gender
 */
export function getInitialTrialCredits(gender: 'MALE' | 'FEMALE'): {
  listenerCredits: number;
  coins: number;
} {
  return {
    listenerCredits: gender === 'MALE' ? 50 : 100,
    coins: 50,
  };
}

/**
 * Check if trial is still active
 */
export function isTrialActive(trialEndsAt: string | null): boolean {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt) > new Date();
}

/**
 * Calculate remaining time for trial
 */
export function getTrialTimeRemaining(trialEndsAt: string | null): TrialInfo {
  if (!trialEndsAt) {
    return {
      isActive: false,
      endsAt: null,
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      secondsRemaining: 0,
      totalSecondsRemaining: 0,
      isExpired: true,
    };
  }

  const now = new Date();
  const end = new Date(trialEndsAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      isActive: false,
      endsAt: trialEndsAt,
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      secondsRemaining: 0,
      totalSecondsRemaining: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    isActive: true,
    endsAt: trialEndsAt,
    daysRemaining: days,
    hoursRemaining: hours,
    minutesRemaining: minutes,
    secondsRemaining: seconds,
    totalSecondsRemaining: Math.floor(diff / 1000),
    isExpired: false,
  };
}

/**
 * Format countdown display
 */
export function formatCountdown(trialInfo: TrialInfo): string {
  if (!trialInfo.isActive) {
    return 'Trial Expired';
  }

  const parts = [];
  if (trialInfo.daysRemaining > 0) {
    parts.push(`${trialInfo.daysRemaining}d`);
  }
  if (trialInfo.hoursRemaining > 0 || trialInfo.daysRemaining > 0) {
    parts.push(`${trialInfo.hoursRemaining}h`);
  }
  if (trialInfo.minutesRemaining > 0 || trialInfo.hoursRemaining > 0 || trialInfo.daysRemaining > 0) {
    parts.push(`${trialInfo.minutesRemaining}m`);
  }
  parts.push(`${trialInfo.secondsRemaining}s`);

  return parts.join(' ');
}

/**
 * Get features available during trial
 */
export function getTrialFeatures(): {
  free: string[];
  locked: string[];
} {
  return {
    free: [
      'Browse cases',
      'Watch video ads for coins',
      'Participate in Gallery Talk',
      'View lawyer profiles',
    ],
    locked: [
      'File cases',
      'Hire lawyers',
      'Testify in cases',
      'Become a lawyer',
      'Become Chief Judge',
    ],
  };
}
