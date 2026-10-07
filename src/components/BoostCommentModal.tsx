import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LISTENER_CREDIT_COSTS } from '../lib/credit-exhaustion';

interface BoostCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  commentPreview: string;
  currentBalance: number;
  onBoost: () => void;
}

export function BoostCommentModal({
  isOpen,
  onClose,
  commentPreview,
  currentBalance,
  onBoost,
}: BoostCommentModalProps) {
  const canAfford = currentBalance >= LISTENER_CREDIT_COSTS.BOOST_COMMENT;

  const handleBoost = () => {
    if (!canAfford) return;
    onBoost();
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
          className="bg-white rounded-3xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📌</div>
            <h2 className="font-heading text-2xl font-bold text-gradient-pink mb-2">
              Boost Your Comment
            </h2>
            <p className="text-pink-600 mb-4">
              Pin your comment at the top for 1 hour
            </p>
          </div>

          <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200 mb-6">
            <p className="text-sm text-pink-700 font-medium mb-2">Your Comment:</p>
            <p className="text-sm text-pink-600 italic line-clamp-3">
              "{commentPreview}"
            </p>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-sky-50 rounded-2xl p-4 border border-pink-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-pink-700 font-medium">Cost:</span>
              <span className="text-lg font-bold text-pink-700">
                💎 {LISTENER_CREDIT_COSTS.BOOST_COMMENT} credits
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-pink-700 font-medium">Duration:</span>
              <span className="text-sm text-pink-600">1 hour</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-pink-700 font-medium">Benefit:</span>
              <span className="text-sm text-pink-600">📌 Pinned at top of Gallery Talk</span>
            </div>
          </div>

          {!canAfford && (
            <div className="mb-4 p-3 rounded-xl bg-pink-50 border border-pink-200">
              <p className="text-sm text-pink-700 text-center">
                💔 Insufficient balance. You need {LISTENER_CREDIT_COSTS.BOOST_COMMENT} credits.
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
              onClick={handleBoost}
              disabled={!canAfford}
              className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: canAfford ? 1.02 : 1 }}
              whileTap={{ scale: canAfford ? 0.98 : 1 }}
            >
              📌 Boost Now
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
