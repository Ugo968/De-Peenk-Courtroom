import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTrialTimeRemaining, formatCountdown } from '../lib/trial-system';
import type { TrialInfo } from '../lib/trial-system';

interface TrialCountdownProps {
  trialEndsAt: string | null;
  onExpire?: () => void;
}

export function TrialCountdown({ trialEndsAt, onExpire }: TrialCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TrialInfo>(
    getTrialTimeRemaining(trialEndsAt)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = getTrialTimeRemaining(trialEndsAt);
      setTimeRemaining(updated);

      // If just expired, trigger callback
      if (updated.isExpired && !timeRemaining.isExpired) {
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [trialEndsAt, onExpire]);

  if (timeRemaining.isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-6 shadow-lg"
      >
        <div className="text-center">
          <div className="text-4xl mb-3">⏰</div>
          <h3 className="font-heading text-xl font-bold text-red-700 mb-2">
            Trial Expired
          </h3>
          <p className="text-sm text-red-600 mb-4">
            Your free trial has ended. Purchase coins to continue using all features.
          </p>
        </div>
      </motion.div>
    );
  }

  const progress = (timeRemaining.totalSecondsRemaining / (3 * 24 * 60 * 60)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-pink-50 via-white to-sky-50 border-2 border-pink-200 rounded-3xl p-6 shadow-lg"
    >
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl">✨</span>
          <h3 className="font-heading text-2xl font-bold text-gradient-pink">
            Free Trial Active
          </h3>
          <span className="text-3xl">✨</span>
        </div>
        <p className="text-sm text-pink-600">
          Enjoy full access during your trial period
        </p>
      </div>

      {/* Countdown Display */}
      <div className="bg-white/80 rounded-2xl p-6 mb-4 border border-pink-100">
        <div className="grid grid-cols-4 gap-3">
          {/* Days */}
          <div className="text-center">
            <motion.div
              key={timeRemaining.daysRemaining}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-xl p-3 shadow-md"
            >
              <div className="font-heading text-3xl font-bold">
                {String(timeRemaining.daysRemaining).padStart(2, '0')}
              </div>
            </motion.div>
            <div className="text-xs text-pink-600 font-medium mt-2">
              Days
            </div>
          </div>

          {/* Hours */}
          <div className="text-center">
            <motion.div
              key={timeRemaining.hoursRemaining}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-sky-400 to-sky-600 text-white rounded-xl p-3 shadow-md"
            >
              <div className="font-heading text-3xl font-bold">
                {String(timeRemaining.hoursRemaining).padStart(2, '0')}
              </div>
            </motion.div>
            <div className="text-xs text-sky-600 font-medium mt-2">
              Hours
            </div>
          </div>

          {/* Minutes */}
          <div className="text-center">
            <motion.div
              key={timeRemaining.minutesRemaining}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-xl p-3 shadow-md"
            >
              <div className="font-heading text-3xl font-bold">
                {String(timeRemaining.minutesRemaining).padStart(2, '0')}
              </div>
            </motion.div>
            <div className="text-xs text-pink-600 font-medium mt-2">
              Minutes
            </div>
          </div>

          {/* Seconds */}
          <div className="text-center">
            <motion.div
              key={timeRemaining.secondsRemaining}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-sky-400 to-sky-600 text-white rounded-xl p-3 shadow-md"
            >
              <div className="font-heading text-3xl font-bold">
                {String(timeRemaining.secondsRemaining).padStart(2, '0')}
              </div>
            </motion.div>
            <div className="text-xs text-sky-600 font-medium mt-2">
              Seconds
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-pink-600 mb-1">
            <span>Trial Progress</span>
            <span>{Math.round(progress)}% remaining</span>
          </div>
          <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 to-sky-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Trial Benefits */}
      <div className="bg-gradient-to-r from-pink-50 to-sky-50 rounded-2xl p-4 border border-pink-100">
        <h4 className="font-heading text-sm font-bold text-pink-700 mb-2">
          🎁 What You Can Do During Trial:
        </h4>
        <ul className="space-y-1 text-xs text-pink-600">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Browse all cases
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Watch video ads for coins
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Participate in Gallery Talk
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            View lawyer profiles
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
