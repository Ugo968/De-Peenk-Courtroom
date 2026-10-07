import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getVideoRewardStatus, 
  getAvailableVideoAds, 
  simulateVideoWatch,
  formatTimeUntilReset,
  VIDEO_REWARD_CONFIG 
} from '../lib/ad-video-rewards';
import type { VideoAd } from '../lib/ad-video-rewards';

interface VideoAdRewardsProps {
  userRole: string;
  currentCredits: number;
  onCreditsEarned: (credits: number) => void;
}

export function VideoAdRewards({ userRole, currentCredits, onCreditsEarned }: VideoAdRewardsProps) {
  const [videosWatchedToday, setVideosWatchedToday] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoAd | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const status = getVideoRewardStatus(userRole, videosWatchedToday);
  const availableVideos = getAvailableVideoAds();

  const handleWatchVideo = async (video: VideoAd) => {
    if (!status.canWatch) {
      if (userRole === 'LAWYER' || userRole === 'CHIEF_JUDGE') {
        setErrorMessage('Lawyers and Chief Judges are exempt from video ads.');
      } else {
        setErrorMessage(`You've reached the daily limit of ${VIDEO_REWARD_CONFIG.maxVideosPerDay} videos.`);
      }
      return;
    }

    setSelectedVideo(video);
    setIsWatching(true);
    setErrorMessage('');

    // Simulate watching the video (in production, this would be handled by the video player)
    setTimeout(() => {
      const result = simulateVideoWatch(userRole, videosWatchedToday);
      
      if (result.success) {
        setEarnedCredits(result.creditsEarned);
        setVideosWatchedToday(prev => prev + 1);
        onCreditsEarned(result.creditsEarned);
        setShowReward(true);
      } else {
        setErrorMessage(result.message);
      }
      
      setIsWatching(false);
    }, 3000); // Simulate 3 seconds of watching
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    setShowReward(false);
    setEarnedCredits(0);
  };

  // Exemption message for lawyers/CJs
  if (userRole === 'LAWYER' || userRole === 'CHIEF_JUDGE') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gold-50 to-pink-50 rounded-3xl p-8 border-2 border-gold-200 text-center"
        >
          <div className="text-6xl mb-4">👑</div>
          <h2 className="font-heading text-3xl font-bold text-gold-700 mb-4">
            Video Ads Exempt
          </h2>
          <p className="text-pink-600 text-lg mb-6">
            As a {userRole === 'LAWYER' ? 'Lawyer' : 'Chief Judge'}, you are exempt from watching video ads.
          </p>
          <div className="bg-white/60 rounded-2xl p-6 border border-gold-200">
            <p className="text-sm text-gold-700 mb-2">
              At the end of your tenure, all your virtual lawyer credits will be converted to listener credits at a 1:1 ratio.
            </p>
            <p className="text-xs text-pink-500">
              These credits are permanently added to your wallet and can be used for case filing, testifying, and other platform features.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-pink mb-4">
          🎬 Watch & Earn
        </h2>
        <p className="text-pink-600/70 text-lg">
          Watch video ads to earn credits • {VIDEO_REWARD_CONFIG.creditsPerVideo} credits per video
        </p>
      </motion.div>

      {/* Daily Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-pink-100 to-sky-100 rounded-3xl p-6 border border-pink-200 shadow-pink mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl font-bold text-pink-700">
              Today's Progress
            </h3>
            <p className="text-sm text-pink-600/70">
              Reset in {formatTimeUntilReset(status.nextResetTime)}
            </p>
          </div>
          <div className="text-right">
            <div className="font-heading text-3xl font-bold text-pink-700">
              {status.videosWatchedToday}/{status.maxVideosPerDay}
            </div>
            <p className="text-sm text-pink-600">videos watched</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full h-4 rounded-full bg-pink-200/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(status.videosWatchedToday / status.maxVideosPerDay) * 100}%` 
              }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-pink-600">
            Credits earned today: <span className="font-bold text-pink-700">{status.creditsEarnedToday}</span>
          </span>
          <span className="text-pink-600">
            Current balance: <span className="font-bold text-pink-700">{currentCredits.toLocaleString()}</span>
          </span>
        </div>
      </motion.div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-red-700">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Available Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-heading text-2xl font-bold text-pink-700 mb-6 flex items-center gap-2">
          🎥 Available Videos
          <span className="text-sm font-normal text-pink-500">
            ({availableVideos.length} videos)
          </span>
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableVideos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-pink transition-all"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-pink-100 to-sky-100 relative">
                {video.thumbnailUrl && (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-8 h-8 text-pink-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/70 text-white text-xs">
                  {video.duration}s
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="font-heading text-lg font-bold text-pink-700 mb-2 line-clamp-2">
                  {video.title}
                </h4>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-pink-500">
                    Provider: {video.provider}
                  </span>
                  <span className="text-sm font-bold text-pink-600">
                    +{VIDEO_REWARD_CONFIG.creditsPerVideo} credits
                  </span>
                </div>

                <motion.button
                  onClick={() => handleWatchVideo(video)}
                  disabled={!status.canWatch || isWatching}
                  className={`w-full px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                    status.canWatch && !isWatching
                      ? 'bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-pink hover:shadow-xl'
                      : 'bg-pink-200 text-pink-400 cursor-not-allowed'
                  }`}
                  whileHover={status.canWatch && !isWatching ? { scale: 1.02 } : {}}
                  whileTap={status.canWatch && !isWatching ? { scale: 0.98 } : {}}
                >
                  {isWatching ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Watching...
                    </span>
                  ) : (
                    '▶️ Watch Video'
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-sm"
      >
        <h3 className="font-heading text-2xl font-bold text-pink-700 mb-6 text-center">
          📜 How It Works
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '1', emoji: '🎬', title: 'Choose Video', desc: 'Select from available video ads' },
            { step: '2', emoji: '▶️', title: 'Watch', desc: `Watch the full ${VIDEO_REWARD_CONFIG.videoDuration}-second video` },
            { step: '3', emoji: '💰', title: 'Earn Credits', desc: `Get ${VIDEO_REWARD_CONFIG.creditsPerVideo} credits instantly` },
            { step: '4', emoji: '🔄', title: 'Repeat', desc: `Up to ${VIDEO_REWARD_CONFIG.maxVideosPerDay} videos per day` },
          ].map((item, i) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center mx-auto mb-3 text-xl">
                {item.emoji}
              </div>
              <h4 className="font-heading font-bold text-pink-700 mb-1">{item.title}</h4>
              <p className="text-xs text-pink-600/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={!isWatching && !showReward ? closeVideo : undefined}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden pointer-events-auto">
                {showReward ? (
                  // Reward Screen
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-12 text-center"
                  >
                    <div className="text-7xl mb-6 animate-float">🎉</div>
                    <h3 className="font-heading text-3xl font-bold text-gradient-pink mb-4">
                      Congratulations!
                    </h3>
                    <p className="text-pink-600 text-lg mb-6">
                      You earned <span className="font-bold text-pink-700 text-2xl">{earnedCredits} credits</span>
                    </p>
                    <div className="bg-pink-50 rounded-2xl p-4 border border-pink-200 mb-6">
                      <p className="text-sm text-pink-700">
                        Videos watched today: {videosWatchedToday}/{VIDEO_REWARD_CONFIG.maxVideosPerDay}
                      </p>
                    </div>
                    <motion.button
                      onClick={closeVideo}
                      className="px-8 py-4 rounded-3xl bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold shadow-pink hover:shadow-xl transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Continue
                    </motion.button>
                  </motion.div>
                ) : (
                  // Video Player
                  <div>
                    <div className="bg-gradient-to-r from-pink-100 to-sky-100 p-4 border-b border-pink-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-xl font-bold text-pink-700">
                          {selectedVideo.title}
                        </h3>
                        <button
                          onClick={closeVideo}
                          disabled={isWatching}
                          className="p-2 rounded-full hover:bg-pink-100 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="aspect-video bg-black">
                      <video
                        src={selectedVideo.videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="p-4 bg-pink-50 border-t border-pink-200">
                      <p className="text-sm text-pink-600 text-center">
                        {isWatching ? 'Watching video...' : 'Video complete! Credits will be awarded.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
