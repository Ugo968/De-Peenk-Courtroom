import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockCases, CATEGORY_EMOJIS } from '../lib/mock-data';

interface HireLawyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  userCoins: number;
  onHireLawyer: (caseId: string) => void;
}

const HIRE_LAWYER_COST = 500;

export function HireLawyerModal({ isOpen, onClose, caseId, userCoins, onHireLawyer }: HireLawyerModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const caseData = mockCases.find(c => c.id === caseId);
  const canAfford = userCoins >= HIRE_LAWYER_COST;

  if (!isOpen || !caseData) return null;

  const handleHireLawyer = async () => {
    if (!canAfford) {
      alert('Insufficient coins to hire a lawyer');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Call parent handler
      onHireLawyer(caseId);

      setShowSuccess(true);

      // Reset after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Hire lawyer error:', error);
      alert('Failed to hire lawyer. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden pointer-events-auto border-2 border-sky-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-100 to-sky-200 p-6 border-b border-sky-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚖️</span>
                <div>
                  <h3 className="font-heading text-xl font-bold text-sky-700">
                    Hire a Lawyer
                  </h3>
                  <p className="text-sm text-sky-600/70">
                    Request dedicated legal representation
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-sky-100 transition-colors"
              >
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {showSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="text-6xl mb-4 animate-float">🎉</div>
                <h4 className="font-heading text-2xl font-bold text-gradient-pink mb-2">
                  Lawyer Hired!
                </h4>
                <p className="text-pink-600">
                  A lawyer has been assigned to your case
                </p>
              </motion.div>
            ) : (
              <>
                {/* Case Details */}
                <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{CATEGORY_EMOJIS[caseData.category]}</span>
                    <h4 className="font-heading text-lg font-bold text-sky-700">
                      Your Case
                    </h4>
                  </div>
                  <p className="text-sm text-sky-600 font-medium mb-2">
                    {caseData.title}
                  </p>
                  <p className="text-xs text-sky-500 line-clamp-2">
                    {caseData.description}
                  </p>
                </div>

                {/* Benefits */}
                <div className="bg-pink-50 rounded-2xl p-4 border border-pink-200 mb-4">
                  <h4 className="font-medium text-pink-700 mb-2">What You Get:</h4>
                  <ul className="space-y-1 text-sm text-pink-600">
                    <li className="flex items-center gap-2">
                      <span>✨</span> Dedicated lawyer for your case
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✨</span> Priority handling
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✨</span> Professional legal advice
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✨</span> Faster resolution
                    </li>
                  </ul>
                </div>

                {/* Cost */}
                <div className="bg-gold-50 rounded-2xl p-4 border border-gold-200 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gold-700">Cost:</span>
                    <span className="font-bold text-xl text-gold-700">
                      {HIRE_LAWYER_COST} coins
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gold-600">Your balance:</span>
                    <span className={`font-bold ${canAfford ? 'text-gold-700' : 'text-red-600'}`}>
                      {userCoins.toLocaleString()} coins
                    </span>
                  </div>
                </div>

                {!canAfford && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4">
                    <p className="text-sm text-red-700">
                      ⚠️ Insufficient coins. You need {HIRE_LAWYER_COST} coins to hire a lawyer.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!showSuccess && (
            <div className="p-6 border-t border-sky-100 bg-sky-50/50">
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 rounded-2xl border-2 border-sky-200 text-sky-600 font-medium hover:bg-sky-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleHireLawyer}
                  disabled={!canAfford || isProcessing}
                  className={`flex-1 px-6 py-3 rounded-2xl font-semibold text-white transition-all ${
                    canAfford && !isProcessing
                      ? 'bg-gradient-to-r from-sky-400 to-sky-600 shadow-lg hover:shadow-xl'
                      : 'bg-sky-200 cursor-not-allowed'
                  }`}
                  whileHover={canAfford && !isProcessing ? { scale: 1.02 } : {}}
                  whileTap={canAfford && !isProcessing ? { scale: 0.98 } : {}}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `⚖️ Hire Lawyer (${HIRE_LAWYER_COST} coins)`
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
