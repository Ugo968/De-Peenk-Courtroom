/**
 * De Peenk Courtroom - Chief Judge Slot System
 * 
 * RULES:
 * - ONLY 2 CJ slots total: 1 Muslim, 1 Christian
 * - Tenure: 2 weeks (14 days) per slot
 * - Price: ₦3,500 per tenure
 * - Queue system when slot is occupied
 * - Only ONE CJ is active at a time in the chamber
 * - Each CJ handles cases related to their religion
 */

export type Religion = 'MUSLIM' | 'CHRISTIAN';

export interface CJSlot {
  id: string;
  religion: Religion;
  currentHolder: CJHolder | null;
  queue: CJQueueEntry[];
  slotExpiry: string | null;
  isActive: boolean;
}

export interface CJHolder {
  userId: string;
  anonymousHandle: string;
  religion: Religion;
  startedAt: string;
  expiresAt: string;
  casesHandled: number;
  reputationScore: number;
}

export interface CJQueueEntry {
  userId: string;
  anonymousHandle: string;
  religion: Religion;
  joinedQueueAt: string;
  position: number;
}

export interface CJSlotPurchaseRequest {
  userId: string;
  religion: Religion;
  anonymousHandle: string;
}

export interface CJSlotPurchaseResponse {
  success: boolean;
  status: 'IMMEDIATE' | 'QUEUED' | 'SLOT_FULL';
  message: string;
  slotDetails?: {
    startsAt: string;
    expiresAt: string;
  };
  queuePosition?: number;
  estimatedWaitDays?: number;
}

export const CJ_SLOT_COUNT = 2;
export const CJ_TENURE_DAYS = 14;
export const CJ_TENURE_MS = CJ_TENURE_DAYS * 24 * 60 * 60 * 1000;
export const CJ_PRICE_NAIRA = 3500;

export const RELIGION_INFO: Record<Religion, { emoji: string; label: string; color: string; description: string }> = {
  MUSLIM: {
    emoji: '☪️',
    label: 'Muslim Chief Judge',
    color: 'from-emerald-100 to-emerald-200',
    description: 'Handles cases involving Muslim women with Islamic principles and cultural understanding',
  },
  CHRISTIAN: {
    emoji: '✝️',
    label: 'Christian Chief Judge',
    color: 'from-sky-100 to-sky-200',
    description: 'Handles cases involving Christian women with biblical wisdom and pastoral care',
  },
};

/**
 * Mock CJ slots for demo
 */
export const mockCJSlots: CJSlot[] = [
  {
    id: 'slot-muslim',
    religion: 'MUSLIM',
    currentHolder: {
      userId: 'cj-muslim-1',
      anonymousHandle: 'CJ-W24-A1B',
      religion: 'MUSLIM',
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      casesHandled: 7,
      reputationScore: 2800,
    },
    queue: [
      {
        userId: 'user-queue-1',
        anonymousHandle: 'FL-AMBU45',
        religion: 'MUSLIM',
        joinedQueueAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        position: 1,
      },
      {
        userId: 'user-queue-2',
        anonymousHandle: 'FL-FAHA78',
        religion: 'MUSLIM',
        joinedQueueAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        position: 2,
      },
    ],
    slotExpiry: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: 'slot-christian',
    religion: 'CHRISTIAN',
    currentHolder: {
      userId: 'cj-christian-1',
      anonymousHandle: 'CJ-W24-C3D',
      religion: 'CHRISTIAN',
      startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      casesHandled: 12,
      reputationScore: 4800,
    },
    queue: [
      {
        userId: 'user-queue-3',
        anonymousHandle: 'FL-GRJO12',
        religion: 'CHRISTIAN',
        joinedQueueAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        position: 1,
      },
    ],
    slotExpiry: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
];

/**
 * Calculate days remaining for a CJ slot
 */
export function getDaysRemaining(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

/**
 * Calculate hours remaining
 */
export function getHoursRemaining(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (60 * 60 * 1000)));
}

/**
 * Check if a slot is available for a given religion
 */
export function isSlotAvailable(slot: CJSlot): boolean {
  if (!slot.currentHolder) return true;
  const now = new Date();
  return new Date(slot.currentHolder.expiresAt) <= now;
}

/**
 * Simulate CJ slot purchase logic
 */
export function simulateCJPurchase(
  slots: CJSlot[],
  request: CJSlotPurchaseRequest
): CJSlotPurchaseResponse {
  const slot = slots.find((s) => s.religion === request.religion);
  
  if (!slot) {
    return {
      success: false,
      status: 'SLOT_FULL',
      message: 'Invalid religion slot',
    };
  }

  // Check if slot is currently occupied
  if (slot.currentHolder && !isSlotAvailable(slot)) {
    // Add to queue
    const queuePosition = slot.queue.length + 1;
    const estimatedWaitDays = queuePosition * CJ_TENURE_DAYS;
    
    return {
      success: true,
      status: 'QUEUED',
      message: `Slot occupied. You've been added to the queue at position ${queuePosition}.`,
      queuePosition,
      estimatedWaitDays,
    };
  }

  // Slot is available - immediate access
  const startsAt = new Date();
  const expiresAt = new Date(Date.now() + CJ_TENURE_MS);
  
  return {
    success: true,
    status: 'IMMEDIATE',
    message: 'Congratulations! You are now the Chief Judge!',
    slotDetails: {
      startsAt: startsAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    },
  };
}

/**
 * Get queue wait time estimate
 */
export function getQueueWaitEstimate(queuePosition: number): string {
  const days = queuePosition * CJ_TENURE_DAYS;
  if (days < 7) return `~${days} days`;
  if (days < 14) return `~1 week`;
  if (days < 30) return `~${Math.floor(days / 7)} weeks`;
  return `~${Math.floor(days / 30)} month(s)`;
}
