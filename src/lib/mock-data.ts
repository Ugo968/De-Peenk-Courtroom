import { UserRole } from './identity';

export type CaseCategory = 'RELATIONSHIPS' | 'MARRIAGE' | 'FAMILY' | 'GIRL_SAFETY' | 'EDUCATION_CAREER' | 'MOTHERHOOD' | 'OTHERS';
export type CaseStatus = 'OPEN' | 'CJ_REVIEW' | 'CJ_ASSIGNED' | 'CJ_HANDLING' | 'DELIBERATING' | 'RESOLVED';

export interface CaseData {
  id: string;
  title: string;
  description: string;
  category: CaseCategory;
  status: CaseStatus;
  plaintiffHandle: string;
  chiefJudgeHandle?: string;
  testimonyCount: number;
  createdAt: string;
  urgency: number;
}

export interface UserData {
  id: string;
  role: UserRole;
  anonymousHandle: string;
  virtualLawyerCredits: number;
  casesWon: number;
  reputationScore: number;
  level: number;
  bio: string;
  isVerified: boolean;
}

export interface TestimonyData {
  id: string;
  content: string;
  caseId: string;
  authorHandle: string;
  authorRole: UserRole;
  createdAt: string;
  likes: number;
}

export const CATEGORY_EMOJIS: Record<CaseCategory, string> = {
  RELATIONSHIPS: '💕',
  MARRIAGE: '💍',
  FAMILY: '👨‍👩‍👧‍👦',
  GIRL_SAFETY: '🛡️',
  EDUCATION_CAREER: '📚',
  MOTHERHOOD: '🤱',
  OTHERS: '✨',
};

export const STATUS_COLORS: Record<CaseStatus, string> = {
  OPEN: 'bg-green-100 text-green-700 border-green-300',
  CJ_REVIEW: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  CJ_ASSIGNED: 'bg-blue-100 text-blue-700 border-blue-300',
  CJ_HANDLING: 'bg-purple-100 text-purple-700 border-purple-300',
  DELIBERATING: 'bg-orange-100 text-orange-700 border-orange-300',
  RESOLVED: 'bg-pink-100 text-pink-700 border-pink-300',
};

export const STATUS_LABELS: Record<CaseStatus, string> = {
  OPEN: 'Open for Hearing',
  CJ_REVIEW: 'Under CJ Review',
  CJ_ASSIGNED: 'CJ Assigned',
  CJ_HANDLING: 'CJ Handling',
  DELIBERATING: 'Deliberating',
  RESOLVED: 'Resolved ✨',
};

export const mockCases: CaseData[] = [
  {
    id: '1',
    title: 'My husband refuses to contribute to household expenses',
    description: 'I have been bearing the full financial burden for 3 years while he spends on personal luxuries. I need justice and a fair ruling on financial responsibility in marriage.',
    category: 'MARRIAGE',
    status: 'CJ_HANDLING',
    plaintiffHandle: 'PT-AB3F2C',
    chiefJudgeHandle: 'CJ-W24-A1B',
    testimonyCount: 12,
    createdAt: '2024-01-15',
    urgency: 4,
  },
  {
    id: '2',
    title: 'Mother-in-law interferes in my parenting decisions',
    description: 'Every decision I make for my children is questioned and overridden by my mother-in-law. My husband takes her side always. I need guidance on boundaries.',
    category: 'FAMILY',
    status: 'OPEN',
    plaintiffHandle: 'PT-MN7D4E',
    testimonyCount: 8,
    createdAt: '2024-01-18',
    urgency: 3,
  },
  {
    id: '3',
    title: 'Workplace harassment by senior colleague',
    description: 'A senior manager has been making inappropriate comments and touching for months. HR has done nothing. I need support and a platform to be heard.',
    category: 'GIRL_SAFETY',
    status: 'DELIBERATING',
    plaintiffHandle: 'PT-KL9F1A',
    chiefJudgeHandle: 'CJ-W24-A1B',
    testimonyCount: 23,
    createdAt: '2024-01-10',
    urgency: 5,
  },
  {
    id: '4',
    title: 'Boyfriend gaslighting me for 2 years',
    description: 'He constantly denies things he said, makes me question my memory and sanity. Friends say leave but I feel trapped. Need clarity and ruling.',
    category: 'RELATIONSHIPS',
    status: 'CJ_REVIEW',
    plaintiffHandle: 'PT-ZX2B8C',
    testimonyCount: 5,
    createdAt: '2024-01-20',
    urgency: 3,
  },
  {
    id: '5',
    title: 'Denied promotion despite being top performer',
    description: 'I have exceeded all KPIs for 3 consecutive years but a less qualified male colleague was promoted. I suspect gender discrimination.',
    category: 'EDUCATION_CAREER',
    status: 'OPEN',
    plaintiffHandle: 'PT-QW5E3G',
    testimonyCount: 3,
    createdAt: '2024-01-22',
    urgency: 2,
  },
  {
    id: '6',
    title: 'Single mother struggling with custody battle',
    description: 'Ex-husband is using financial power to deny me access to my children. Court process is too expensive. Seeking community judgment and support.',
    category: 'MOTHERHOOD',
    status: 'CJ_ASSIGNED',
    plaintiffHandle: 'PT-RY6H4J',
    chiefJudgeHandle: 'CJ-W24-A1B',
    testimonyCount: 15,
    createdAt: '2024-01-12',
    urgency: 5,
  },
];

export const mockTestimonies: TestimonyData[] = [
  {
    id: '1',
    content: 'Sister, I have been in this exact situation. My ex used to do the same thing. The court ruled in my favor and I got 60% of household expenses covered. Stay strong! 💪',
    caseId: '1',
    authorHandle: 'FL-CEOK89',
    authorRole: 'LISTENER',
    createdAt: '2024-01-16',
    likes: 34,
  },
  {
    id: '2',
    content: 'As a legal advocate, I can confirm that under Nigerian law, both partners have financial responsibility in a marriage. This is clearly documented in the Matrimonial Causes Act.',
    caseId: '1',
    authorHandle: 'LW-NA7B2F',
    authorRole: 'LAWYER',
    createdAt: '2024-01-17',
    likes: 56,
  },
  {
    id: '3',
    content: 'This is unacceptable behavior. Every woman deserves to feel safe at her workplace. I testify that this pattern is common and needs to be addressed collectively.',
    caseId: '3',
    authorHandle: 'FL-ANJO45',
    authorRole: 'LISTENER',
    createdAt: '2024-01-11',
    likes: 89,
  },
  {
    id: '4',
    content: 'Gaslighting is a form of emotional abuse. The pattern you describe is textbook. I recommend documenting everything and seeking professional support. You deserve peace.',
    caseId: '4',
    authorHandle: 'LW-KM3D9E',
    authorRole: 'LAWYER',
    createdAt: '2024-01-21',
    likes: 42,
  },
];

export const mockUsers: UserData[] = [
  {
    id: '1',
    role: 'CHIEF_JUDGE',
    anonymousHandle: 'CJ-W24-A1B',
    virtualLawyerCredits: 500,
    casesWon: 47,
    reputationScore: 9800,
    level: 10,
    bio: 'Serving justice with wisdom and compassion 👑',
    isVerified: true,
  },
  {
    id: '2',
    role: 'LAWYER',
    anonymousHandle: 'LW-NA7B2F',
    virtualLawyerCredits: 230,
    casesWon: 18,
    reputationScore: 4500,
    level: 7,
    bio: 'Advocate for women\'s rights ⚖️',
    isVerified: true,
  },
  {
    id: '3',
    role: 'LISTENER',
    anonymousHandle: 'FL-CEOK89',
    virtualLawyerCredits: 50,
    casesWon: 0,
    reputationScore: 1200,
    level: 3,
    bio: 'Here to listen and support 💖',
    isVerified: false,
  },
  {
    id: '4',
    role: 'PLAINTIFF',
    anonymousHandle: 'PT-AB3F2C',
    virtualLawyerCredits: 10,
    casesWon: 0,
    reputationScore: 300,
    level: 1,
    bio: 'Seeking justice ✨',
    isVerified: false,
  },
];
