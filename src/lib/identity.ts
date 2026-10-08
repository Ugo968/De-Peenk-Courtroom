/**
 * De Peenk Courtroom - Anonymous Identity Generator
 * 
 * Security & Anonymity Algorithm:
 * Users get ONE strict role. Real names/emails are encrypted.
 * Publicly, they use algorithmic anonymous handles.
 * 
 * UPDATED: Now incorporates gender and religion for handle generation
 */

export type UserRole = 'LISTENER' | 'LAWYER' | 'CHIEF_JUDGE' | 'PLAINTIFF';
export type Gender = 'MALE' | 'FEMALE';
export type Religion = 'MUSLIM' | 'CHRISTIAN';

export interface IdentityInput {
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: Gender;
  religion?: Religion;
}

/**
 * Get the current ISO week number of the year
 */
function getCurrentWeekNumber(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

/**
 * Generate a random hex string of given length
 */
function randomHex(length: number): string {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * Shuffle a string's characters
 */
function shuffleString(str: string): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

/**
 * Generate an anonymous handle based on role and user data
 * 
 * Rules:
 * 1. Listener/Floor Member (FL-): `FL-` + last 2 letters of first name + first 2 letters of last name + last 2 digits of phone
 * 2. Lawyer (LW-): `LW-` + shuffled first/last initials + 4-char random hex
 * 3. Chief Judge (CJ-): `CJ-W[CurrentWeekNumber]-[3-char random hex]`
 * 4. Plaintiff (PT-): `PT-` + shuffled initials + 4-char random hex
 * 
 * UPDATED: Gender prefix for male listeners (ML-) to distinguish pricing
 */
export function generateAnonymousHandle(input: IdentityInput): string {
  const { role, firstName = '', lastName = '', phone = '', gender } = input;

  switch (role) {
    case 'LISTENER': {
      // UPDATED: Male listeners get ML- prefix for pricing distinction
      const prefix = gender === 'MALE' ? 'ML' : 'FL';
      const lastTwoFirst = firstName.slice(-2).toUpperCase();
      const firstTwoLast = lastName.slice(0, 2).toUpperCase();
      const lastTwoPhone = phone.slice(-2);
      return `${prefix}-${lastTwoFirst}${firstTwoLast}${lastTwoPhone}`;
    }

    case 'LAWYER': {
      // LW- + shuffled first/last initials + 4-char random hex
      const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
      const shuffled = shuffleString(initials);
      const hex = randomHex(4);
      return `LW-${shuffled}${hex}`;
    }

    case 'CHIEF_JUDGE': {
      // UPDATED: Include religion in CJ handle for slot identification
      const weekNum = getCurrentWeekNumber();
      const hex = randomHex(3);
      const religionPrefix = input.religion === 'MUSLIM' ? 'M' : 'C';
      return `CJ-${religionPrefix}W${weekNum}-${hex}`;
    }

    case 'PLAINTIFF': {
      // PT- + shuffled initials + 4-char random hex
      const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
      const shuffled = shuffleString(initials);
      const hex = randomHex(4);
      return `PT-${shuffled}${hex}`;
    }

    default:
      throw new Error(`Unknown role: ${role}`);
  }
}

/**
 * Get a display-friendly role name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'LISTENER': return 'Floor Listener 💖';
    case 'LAWYER': return 'Legal Advocate ⚖️';
    case 'CHIEF_JUDGE': return 'Chief Judge 👑';
    case 'PLAINTIFF': return 'Plaintiff 🎀';
    default: return role;
  }
}

/**
 * Get role badge color classes
 */
export function getRoleBadgeClasses(role: UserRole): string {
  switch (role) {
    case 'LISTENER': return 'bg-pink-100 text-pink-700 border-pink-300';
    case 'LAWYER': return 'bg-sky-100 text-sky-700 border-sky-300';
    case 'CHIEF_JUDGE': return 'bg-gold-100 text-gold-700 border-gold-400';
    case 'PLAINTIFF': return 'bg-pink-50 text-pink-600 border-pink-200';
    default: return 'bg-gray-100 text-gray-700';
  }
}

/**
 * Get religion display info
 */
export function getReligionInfo(religion: Religion): { emoji: string; label: string } {
  switch (religion) {
    case 'MUSLIM': return { emoji: '☪️', label: 'Muslim' };
    case 'CHRISTIAN': return { emoji: '✝️', label: 'Christian' };
  }
}
