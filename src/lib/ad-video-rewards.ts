/**
 * De Peenk Courtroom - Ad Video Rewards System
 * 
 * RULES:
 * - Listeners can watch popup ad videos to earn 10 credits per video
 * - Limit: Max 20 videos per day per listener (to prevent abuse)
 * - Lawyers and Chief Judges are EXEMPT from video ads
 * - At END of tenure, lawyers/CJs convert ALL virtual credits to listener credits (1:1 ratio)
 * - Video ad provider: Placeholder system (can swap with Adsterra, Google AdSense, etc.)
 */

export interface VideoRewardConfig {
  creditsPerVideo: number;
  maxVideosPerDay: number;
  videoDuration: number; // in seconds
}

export interface AdVideoView {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  count: number;
}

export interface VideoRewardStatus {
  canWatch: boolean;
  videosWatchedToday: number;
  maxVideosPerDay: number;
  creditsEarnedToday: number;
  nextResetTime: string;
}

export interface VideoAd {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number; // seconds
  provider: 'PLACEHOLDER' | 'ADSTERRA' | 'GOOGLE_ADSENSE';
  isActive: boolean;
}

export const VIDEO_REWARD_CONFIG: VideoRewardConfig = {
  creditsPerVideo: 10,
  maxVideosPerDay: 20,
  videoDuration: 30, // 30 seconds
};

/**
 * Mock video ads for demo
 */
export const mockVideoAds: VideoAd[] = [
  {
    id: 'video-1',
    title: 'Glow Beauty - Feel Like Royalty',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://via.placeholder.com/640x360/FFD1DC/C71585?text=Glow+Beauty',
    duration: 30,
    provider: 'PLACEHOLDER',
    isActive: true,
  },
  {
    id: 'video-2',
    title: 'Crown Wellness Spa - Royal Treatment',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    thumbnailUrl: 'https://via.placeholder.com/640x360/FFF3B0/B39700?text=Crown+Wellness',
    duration: 30,
    provider: 'PLACEHOLDER',
    isActive: true,
  },
  {
    id: 'video-3',
    title: 'Naija Fashion House - Elegant Styles',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://via.placeholder.com/640x360/E0F6FF/007399?text=Naija+Fashion',
    duration: 30,
    provider: 'PLACEHOLDER',
    isActive: true,
  },
];

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Check if user can watch videos (role-based exemption)
 */
export function canWatchVideos(userRole: string): boolean {
  // Lawyers and Chief Judges are exempt from video ads
  return userRole === 'LISTENER' || userRole === 'PLAINTIFF';
}

/**
 * Check if user has reached daily video limit
 */
export function hasReachedDailyLimit(videosWatchedToday: number): boolean {
  return videosWatchedToday >= VIDEO_REWARD_CONFIG.maxVideosPerDay;
}

/**
 * Calculate credits earned from watching videos
 */
export function calculateVideoCredits(videosWatched: number): number {
  return videosWatched * VIDEO_REWARD_CONFIG.creditsPerVideo;
}

/**
 * Get next reset time (midnight)
 */
export function getNextResetTime(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

/**
 * Get video reward status for a user
 */
export function getVideoRewardStatus(
  userRole: string,
  videosWatchedToday: number
): VideoRewardStatus {
  const canWatch = canWatchVideos(userRole) && !hasReachedDailyLimit(videosWatchedToday);
  
  return {
    canWatch,
    videosWatchedToday,
    maxVideosPerDay: VIDEO_REWARD_CONFIG.maxVideosPerDay,
    creditsEarnedToday: calculateVideoCredits(videosWatchedToday),
    nextResetTime: getNextResetTime(),
  };
}

/**
 * Simulate video watch and credit reward
 */
export function simulateVideoWatch(
  userRole: string,
  videosWatchedToday: number
): { success: boolean; creditsEarned: number; message: string } {
  // Check role exemption
  if (!canWatchVideos(userRole)) {
    return {
      success: false,
      creditsEarned: 0,
      message: 'Lawyers and Chief Judges are exempt from video ads.',
    };
  }

  // Check daily limit
  if (hasReachedDailyLimit(videosWatchedToday)) {
    return {
      success: false,
      creditsEarned: 0,
      message: `You've reached the daily limit of ${VIDEO_REWARD_CONFIG.maxVideosPerDay} videos. Come back tomorrow!`,
    };
  }

  // Award credits
  const creditsEarned = VIDEO_REWARD_CONFIG.creditsPerVideo;
  
  return {
    success: true,
    creditsEarned,
    message: `Congratulations! You earned ${creditsEarned} credits!`,
  };
}

/**
 * Convert virtual lawyer credits to listener credits at tenure end
 * This is called when a lawyer/CJ's tenure expires
 */
export function convertVirtualCreditsToListenerCredits(
  virtualLawyerCredits: number,
  currentListenerCredits: number
): { newListenerCredits: number; convertedAmount: number } {
  // 1:1 conversion ratio
  const convertedAmount = virtualLawyerCredits;
  const newListenerCredits = currentListenerCredits + convertedAmount;
  
  return {
    newListenerCredits,
    convertedAmount,
  };
}

/**
 * Get available video ads
 */
export function getAvailableVideoAds(): VideoAd[] {
  return mockVideoAds.filter(ad => ad.isActive);
}

/**
 * Format time until next reset
 */
export function formatTimeUntilReset(nextResetTime: string): string {
  const now = new Date();
  const reset = new Date(nextResetTime);
  const diff = reset.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
