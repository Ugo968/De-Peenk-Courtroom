import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LISTENER_CREDIT_COSTS } from '../lib/credit-exhaustion';

interface VirtualGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientRole: 'LAWYER' | 'CHIEF_JUDGE';
  currentBalance: number;
  onSendGift: () => void;
}

export function VirtualGiftModal({
  isOpen,
  onClose,
  recipientName,
  recipientRole,
  currentBalance,
  onSendGift,
}: VirtualGiftModalProps) {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  if (!isOpen) return null;

  const gifts = [
    { id: 'rose', emoji: '🌹', name: 'Rose', cost: LISTENER_CREDIT_COSTS.VIRTUAL_GIFT },
    { id: 'heart', emoji: '💖', name: 'Heart', cost: LISTENER_CREDIT_COSTS.VIRTUAL_GIFT },
    { id: 'star', emoji: '⭐', name: 'Star', cost: LISTENER_CREDIT_COSTS.VIRTUAL_GIFT },
    { id: 'crown', emoji: '👑', name: 'Crown', cost: LISTENER_CREDIT_COSTS.VIRTUAL_GIFT },
  ];

  const canAfford = currentBalance >= LISTENER_CREDIT_COSTS.VIRTUAL_GIFT;

  const handleSendGift = () => {
    if (!selectedGift || !canAfford) return;
    onSendGift();
    onClose();
  };

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
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="font-heading text-2xl font-bold text-gradient-pink mb-2">
              Send a Virtual Gift
            </h2>
            <p className="text-pink-600">
              Show your appreciation to {recipientName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {gifts.map((gift) => (
              <motion.button
                key={gift.id}
                onClick={() => setSelectedGift(gift.id)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  selectedGift === gift.id
                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                    : 'border-pink-200 bg-white hover:border-pink-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-4xl mb-2">{gift.emoji}</div>
                <div className="text-sm font-bold text-pink-700">{gift.name}</div>
                <div className="text-xs text-pink-600">{gift.cost} credits</div>
              </motion.button>
            ))}
          </div>

          {!canAfford && (
            <div className="mb-4 p-3 rounded-xl bg-pink-50 border border-pink-200">
              <p className="text-sm text-pink-700 text-center">
                💔 Insufficient balance. You need {LISTENER_CREDIT_COSTS.VIRTUAL_GIFT} credits.
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
              onClick={handleSendGift}
              disabled={!selectedGift || !canAfford}
              className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: selectedGift && canAfford ? 1.02 : 1 }}
              whileTap={{ scale: selectedGift && canAfford ? 0.98 : 1 }}
            >
              🎁 Send Gift
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
