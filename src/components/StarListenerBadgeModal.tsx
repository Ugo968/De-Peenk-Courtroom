import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LISTENER_CREDIT_COSTS } from '../lib/credit-exhaustion';

interface StarListenerBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onActivate: () => void;
}

export function StarListenerBadgeModal({
  isOpen,
  onClose,
  currentBalance,
  onActivate,
}: StarListenerBadgeModalProps) {
  const canAfford = currentBalance >= LISTENER_CREDIT_COSTS.STAR_LISTENER_BADGE;

  const handleActivate = () => {
    if (!canAfford) return;
    onActivate();
    onClose();
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
          className="bg-gradient-to-br from-gold-100 via-white to-pink-100 rounded-3xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-7xl mb-4"
            >
              ⭐
            </motion.div>
            <h2 className="font-heading text-2xl font-bold text-gradient-gold mb-2">
              Become a Star Listener
            </h2>
            <p className="text-pink-600 mb-4">
              Get a sparkle badge on your profile for 24 hours
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border-2 border-gold-300 mb-6">
            <h3 className="font-heading text-lg font-bold text-gold-700 mb-3">
              Star Listener Benefits:
            </h3>
            <ul className="space-y-2 text-sm text-pink-700">
              <li className="flex items-center gap-2">
                <span className="text-gold-500">✨</span>
                Sparkle badge on your profile
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-500">✨</span>
                Priority visibility in Gallery Talk
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-500">✨</span>
                Special recognition from community
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-500">✨</span>
                Valid for 24 hours
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-gold-50 to-pink-50 rounded-2xl p-4 border border-gold-200 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gold-700 font-medium">Cost:</span>
              <span className="text-lg font-bold text-gold-700">
                💎 {LISTENER_CREDIT_COSTS.STAR_LISTENER_BADGE} credits
              </span>
            </div>
          </div>

          {!canAfford && (
            <div className="mb-4 p-3 rounded-xl bg-pink-50 border border-pink-200">
              <p className="text-sm text-pink-700 text-center">
                💔 Insufficient balance. You need {LISTENER_CREDIT_COSTS.STAR_LISTENER_BADGE} credits.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <motion.button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-full border-2 border-pink-300 text-pink-700 font-bold hover:bg-pink-50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleActivate}
              disabled={!canAfford}
              className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: canAfford ? 1.02 : 1 }}
              whileTap={{ scale: canAfford ? 0.98 : 1 }}
            >
              ⭐ Activate Badge
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
