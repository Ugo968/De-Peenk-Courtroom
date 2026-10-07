import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getExhaustionNotice } from '../lib/credit-exhaustion';
import type { CreditBalance } from '../lib/credit-exhaustion';
import { RechargeModal } from './RechargeModal';

interface ExhaustionNoticeProps {
  balance: CreditBalance;
  creditType: 'listenerCredits' | 'coins';
}

export function ExhaustionNotice({ balance, creditType }: ExhaustionNoticeProps) {
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const notice = getExhaustionNotice(balance, creditType);

  if (!notice) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`rounded-2xl p-4 border-2 ${
            notice.type === 'ZERO_BALANCE'
              ? 'bg-gradient-to-r from-pink-100 to-pink-200 border-pink-400'
              : 'bg-gradient-to-r from-pink-50 to-pink-100 border-pink-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{notice.emoji}</span>
              <div>
                <p className="font-heading text-sm font-bold text-pink-700">
                  {notice.message}
                </p>
                {notice.type === 'LOW_BALANCE' && (
                  <p className="text-xs text-pink-600 mt-1">
                    Recharge now to continue using premium features
                  </p>
                )}
              </div>
            </div>
            {notice.showRechargeModal && (
              <motion.button
                onClick={() => setShowRechargeModal(true)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💳 Recharge Now
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <RechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        creditType={creditType}
      />
    </>
  );
}
