import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DAILY_REWARDS } from '../lib/credit-exhaustion';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  onClaimReward: (reward: number) => void;
}

export function DailyRewardModal({
  isOpen,
  onClose,
  currentStreak,
  onClaimReward,
}: DailyRewardModalProps) {
  const [claimed, setClaimed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const isStreakBonus = currentStreak === 7;
  const reward = DAILY_REWARDS.DAILY_LOGIN + (isStreakBonus ? DAILY_REWARDS.SEVEN_DAY_STREAK_BONUS : 0);

  useEffect(() => {
    if (isOpen) {
      setClaimed(false);
      setShowConfetti(false);
    }
  }, [isOpen]);

  const handleClaim = () => {
    setClaimed(true);
    setShowConfetti(true);
    onClaimReward(reward);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-pink-100 via-white to-sky-100 rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -100, x: Math.random() * 400 - 200, opacity: 1 }}
                  animate={{ y: 500, opacity: 0 }}
                  transition={{ duration: 2, delay: Math.random() * 0.5 }}
                  className="absolute text-2xl"
                >
                  {['🎉', '✨', '💖', '⭐'][Math.floor(Math.random() * 4)]}
                </motion.div>
              ))}
            </div>
          )}

          {!claimed ? (
            <>
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-7xl mb-4"
                >
                  {isStreakBonus ? '🔥' : '🎁'}
                </motion.div>
                <h2 className="font-heading text-3xl font-bold text-gradient-pink mb-2">
                  {isStreakBonus ? '7-Day Streak Bonus!' : 'Daily Login Reward'}
                </h2>
                <p className="text-pink-600 mb-4">
                  {isStreakBonus
                    ? 'Amazing! You\'ve logged in for 7 days straight!'
                    : 'Welcome back! Here\'s your daily reward'}
                </p>

                {/* Streak Display */}
                <div className="flex justify-center gap-2 mb-4">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i < currentStreak
                          ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white'
                          : 'bg-pink-100 text-pink-400'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                <div className="bg-white/80 rounded-2xl p-4 border-2 border-pink-200">
                  <div className="text-5xl font-bold text-gradient-pink mb-2">
                    +{reward}
                  </div>
                  <div className="text-sm text-pink-600">
                    {isStreakBonus ? 'Listener Credits' : 'Listener Credits'}
                  </div>
                  {isStreakBonus && (
                    <div className="text-xs text-pink-500 mt-1">
                      ({DAILY_REWARDS.DAILY_LOGIN} daily + {DAILY_REWARDS.SEVEN_DAY_STREAK_BONUS} streak bonus)
                    </div>
                  )}
                </div>
              </div>

              <motion.button
                onClick={handleClaim}
                className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🎁 Claim Reward
              </motion.button>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="font-heading text-3xl font-bold text-gradient-pink mb-2">
                Reward Claimed!
              </h2>
              <p className="text-pink-600">
                +{reward} credits added to your balance
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
