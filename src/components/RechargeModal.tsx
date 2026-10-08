import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CREDIT_PACKAGES } from '../lib/economy';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditType: 'listenerCredits' | 'coins';
}

export function RechargeModal({ isOpen, onClose, creditType }: RechargeModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePurchase = () => {
    if (!selectedPackage) return;
    // In production, this would call the payment API
    console.log('Purchasing package:', selectedPackage);
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
          className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💳</div>
            <h2 className="font-heading text-3xl font-bold text-gradient-pink mb-2">
              Recharge Your {creditType === 'listenerCredits' ? 'Credits' : 'Coins'}
            </h2>
            <p className="text-pink-600">
              Choose a package to continue using premium features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {CREDIT_PACKAGES.map((pkg) => (
              <motion.button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedPackage === pkg.id
                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                    : 'border-pink-200 bg-white hover:border-pink-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-4xl mb-2">{pkg.emoji}</div>
                <h3 className="font-heading text-xl font-bold text-pink-700 mb-2">
                  {pkg.label}
                </h3>
                <p className="text-sm text-pink-600 mb-3">{pkg.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-pink-700">
                    ₦{pkg.amountNaira.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-pink-600">
                    {pkg.credits.toLocaleString()} {creditType === 'listenerCredits' ? 'credits' : 'coins'}
                  </span>
                </div>
                {pkg.badge && (
                  <div className="mt-2 inline-block px-3 py-1 rounded-full bg-gold-400 text-white text-xs font-bold">
                    {pkg.badge}
                  </div>
                )}
              </motion.button>
            ))}
          </div>

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
              onClick={handlePurchase}
              disabled={!selectedPackage}
              className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: selectedPackage ? 1.02 : 1 }}
              whileTap={{ scale: selectedPackage ? 0.98 : 1 }}
            >
              💳 Purchase Now
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
