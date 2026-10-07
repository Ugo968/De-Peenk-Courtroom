/**
 * De Peenk Courtroom - Lawyer Slot System
 * 
 * RULES:
 * - Maximum 20 lawyers total: 10 Muslim, 10 Christian
 * - Tenure: 2 weeks (14 days) per slot
 * - Price: ₦2,000 per tenure
 * - Males CANNOT become lawyers (enforced at signup + payment)
 * - Queue system when slots are full
 * - Auto-expiry cron job
 */

export type Religion = 'MUSLIM' | 'CHRISTIAN';
export type Gender = 'FEMALE' | 'MALE';

export interface LawyerSlot {
  religion: Religion;
  currentCount: number;
  maxCount: number;
  availableSlots: number;
  waitlist: LawyerWaitlistEntry[];
}

export interface LawyerWaitlistEntry {
  userId: string;
  anonymousHandle: string;
  religion: Religion;
  joinedAt: string;
  position: number;
}

export interface LawyerSlotPurchaseRequest {
  userId: string;
  religion: Religion;
  gender: Gender;
  anonymousHandle: string;
}

export interface LawyerSlotPurchaseResponse {
  success: boolean;
  status: 'IMMEDIATE' | 'WAITLISTED' | 'SLOTS_FULL' | 'GENDER_RESTRICTED';
  message: string;
  slotDetails?: {
    startsAt: string;
    expiresAt: string;
  };
  waitlistPosition?: number;
  estimatedWaitDays?: number;
}

export const LAWYER_SLOT_COUNT = 20;
export const LAWYER_SLOT_PER_RELIGION = 10;
export const LAWYER_TENURE_DAYS = 14;
export const LAWYER_TENURE_MS = LAWYER_TENURE_DAYS * 24 * 60 * 60 * 1000;
export const LAWYER_PRICE_NAIRA = 2000;

export const RELIGION_INFO: Record<Religion, { emoji: string; label: string; color: string }> = {
  MUSLIM: {
    emoji: '☪️',
    label: 'Muslim Lawyers',
    color: 'from-emerald-100 to-emerald-200',
  },
  CHRISTIAN: {
    emoji: '✝️',
    label: 'Christian Lawyers',
    color: 'from-sky-100 to-sky-200',
  },
};

/**
 * Mock lawyer slots for demo
 */
export const mockLawyerSlots: LawyerSlot[] = [
  {
    religion: 'MUSLIM',
    currentCount: 7,
    maxCount: 10,
    availableSlots: 3,
    waitlist: [
      {
        userId: 'user-wl-1',
        anonymousHandle: 'FL-AMBU45',
        religion: 'MUSLIM',
        joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        position: 1,
      },
    ],
  },
  {
    religion: 'CHRISTIAN',
    currentCount: 10,
    maxCount: 10,
    availableSlots: 0,
    waitlist: [
      {
        userId: 'user-wl-2',
        anonymousHandle: 'FL-GRJO12',
        religion: 'CHRISTIAN',
        joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        position: 1,
      },
      {
        userId: 'user-wl-3',
        anonymousHandle: 'FL-FAHA78',
        religion: 'CHRISTIAN',
        joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        position: 2,
      },
    ],
  },
];

/**
 * Calculate days remaining for a lawyer slot
 */
export function getDaysRemaining(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

/**
 * Check if user can become a lawyer (gender validation)
 */
export function canBecomeLawyer(gender: Gender): boolean {
  return gender === 'FEMALE';
}

/**
 * Check if slots are available for a religion
 */
export function areSlotsAvailable(slot: LawyerSlot): boolean {
  return slot.availableSlots > 0;
}

/**
 * Simulate lawyer slot purchase logic
 */
export function simulateLawyerPurchase(
  slots: LawyerSlot[],
  request: LawyerSlotPurchaseRequest
): LawyerSlotPurchaseResponse {
  // Gender validation
  if (!canBecomeLawyer(request.gender)) {
    return {
      success: false,
      status: 'GENDER_RESTRICTED',
      message: 'Only women can become lawyers on De Peenk Courtroom.',
    };
  }

  const slot = slots.find((s) => s.religion === request.religion);
  
  if (!slot) {
    return {
      success: false,
      status: 'SLOTS_FULL',
      message: 'Invalid religion slot',
    };
  }

  // Check if slots are available
  if (!areSlotsAvailable(slot)) {
    // Add to waitlist
    const waitlistPosition = slot.waitlist.length + 1;
    const estimatedWaitDays = waitlistPosition * LAWYER_TENURE_DAYS;
    
    return {
      success: true,
      status: 'WAITLISTED',
      message: `All slots occupied. You've been added to the waitlist at position ${waitlistPosition}.`,
      waitlistPosition,
      estimatedWaitDays,
    };
  }

  // Slot is available - immediate access
  const startsAt = new Date();
  const expiresAt = new Date(Date.now() + LAWYER_TENURE_MS);
  
  return {
    success: true,
    status: 'IMMEDIATE',
    message: 'Congratulations! You are now a Lawyer!',
    slotDetails: {
      startsAt: startsAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    },
  };
}

/**
 * Get waitlist wait time estimate
 */
export function getWaitlistWaitEstimate(waitlistPosition: number): string {
  const days = waitlistPosition * LAWYER_TENURE_DAYS;
  if (days < 7) return `~${days} days`;
  if (days < 14) return `~1 week`;
  if (days < 30) return `~${Math.floor(days / 7)} weeks`;
  return `~${Math.floor(days / 30)} month(s)`;
}
