import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CREDIT_PACKAGES, type PackageType, type CreditPackage } from '../lib/economy';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onSuccess?: (packageType: PackageType, credits: number) => void;
}

export function BuyCreditsModal({ isOpen, onClose, userEmail = 'user@example.com', onSuccess }: BuyCreditsModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectPackage = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);

    try {
      // In production, this would call: POST /api/paystack/initialize
      // For demo, we simulate the Paystack redirect flow
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, redirect to Paystack:
      // window.location.href = data.authorizationUrl;
      
      // For demo, simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      
      if (onSuccess) {
        onSuccess(selectedPackage.id, selectedPackage.credits);
      }

      // Reset after showing success
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSelectedPackage(null);
    setShowSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  const getColorClasses = (color: 'pink' | 'sky' | 'gold') => {
    switch (color) {
      case 'pink':
        return {
          bg: 'bg-gradient-to-br from-pink-100 to-pink-200',
          border: 'border-pink-300',
          text: 'text-pink-700',
          selected: 'ring-pink-400 bg-gradient-to-br from-pink-200 to-pink-300',
        };
      case 'sky':
        return {
          bg: 'bg-gradient-to-br from-sky-100 to-sky-200',
          border: 'border-sky-300',
          text: 'text-sky-700',
          selected: 'ring-sky-400 bg-gradient-to-br from-sky-200 to-sky-300',
        };
      case 'gold':
        return {
          bg: 'bg-gradient-to-br from-gold-100 to-gold-200',
          border: 'border-gold-400',
          text: 'text-gold-700',
          selected: 'ring-gold-500 bg-gradient-to-br from-gold-200 to-gold-300',
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto border border-pink-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-100 via-pink-50 to-sky-100 p-6 border-b border-pink-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-gradient-pink">
              💰 Buy Coins
            </h2>
            <p className="text-sm text-pink-600/70 mt-1">
              Secure payment via Paystack • Naira (₦)
            </p>
          </div>                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-pink-100 transition-colors"
                  >
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {showSuccess ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4 animate-float">🎉</div>
                    <h3 className="font-heading text-2xl font-bold text-gradient-pink mb-2">
                      Payment Successful!
                    </h3>
                    <p className="text-pink-600">
                      Your wallet has been credited with{' '}
                      <span className="font-bold text-pink-700">
                        {selectedPackage?.credits.toLocaleString()} coins
                      </span>
                    </p>
                    <p className="text-sm text-pink-400 mt-4">
                      Redirecting to dashboard...
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Package Selection */}
                    <div className="mb-6">
                      <h3 className="font-heading text-lg font-bold text-pink-700 mb-4">
                        Select a Package
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {CREDIT_PACKAGES.map((pkg) => {
                          const colors = getColorClasses(pkg.color);
                          const isSelected = selectedPackage?.id === pkg.id;

                          return (
                            <motion.button
                              key={pkg.id}
                              onClick={() => handleSelectPackage(pkg)}
                              className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                                isSelected
                                  ? `${colors.selected} ${colors.border} ring-2 ${colors.selected.split(' ')[0]}`
                                  : `${colors.bg} ${colors.border} hover:shadow-lg`
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Badge */}
                              {pkg.badge && (
                                <div className="absolute top-3 right-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    pkg.color === 'gold' 
                                      ? 'bg-gold-400 text-white' 
                                      : pkg.color === 'pink'
                                      ? 'bg-pink-400 text-white'
                                      : 'bg-sky-400 text-white'
                                  }`}>
                                    {pkg.badge}
                                  </span>
                                </div>
                              )}

                              {/* Emoji & Label */}
                              <div className="flex items-start gap-3 mb-3">
                                <span className="text-3xl">{pkg.emoji}</span>
                                <div>
                                  <h4 className={`font-heading font-bold ${colors.text}`}>
                                    {pkg.label}
                                  </h4>
                                  {pkg.duration && (
                                    <p className="text-xs text-pink-500 mt-0.5">{pkg.duration}</p>
                                  )}
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-sm text-pink-600/70 mb-3">
                                {pkg.description}
                              </p>

                              {/* Price & Coins */}
                              <div className="flex items-center justify-between pt-3 border-t border-white/50">
                                <div>
                                  <div className="text-xs text-pink-500">Price</div>
                                  <div className={`font-bold text-lg ${colors.text}`}>
                                    ₦{pkg.amountNaira.toLocaleString()}
                                  </div>
                                </div>
                                {pkg.credits > 0 && (
                                  <div className="text-right">
                                    <div className="text-xs text-pink-500">Coins</div>
                                    <div className={`font-bold text-lg ${colors.text}`}>
                                      {pkg.credits.toLocaleString()}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Selected Indicator */}
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-3 left-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                                >
                                  <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Payment Summary */}
                    {selectedPackage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-pink-50 rounded-2xl p-5 border border-pink-200"
                      >
                        <h4 className="font-heading font-bold text-pink-700 mb-3">
                          📋 Payment Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-pink-600">Package:</span>
                            <span className="font-medium text-pink-700">{selectedPackage.label}</span>
                          </div>
                          {selectedPackage.credits > 0 && (
                            <div className="flex justify-between">
                              <span className="text-pink-600">Coins:</span>
                              <span className="font-medium text-pink-700">
                                {selectedPackage.credits.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between pt-2 border-t border-pink-200">
                            <span className="text-pink-600 font-medium">Total:</span>
                            <span className="font-bold text-lg text-pink-700">
                              ₦{selectedPackage.amountNaira.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-white rounded-xl border border-pink-100">
                          <p className="text-xs text-pink-500">
                            💳 Payment will be processed securely via Paystack. 
                            You will be redirected to complete the transaction.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {!showSuccess && (
                <div className="p-6 border-t border-pink-100 bg-pink-50/50">
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 px-6 py-3 rounded-2xl border-2 border-pink-200 text-pink-600 font-medium hover:bg-pink-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleProceedToPayment}
                      disabled={!selectedPackage || isProcessing}
                      className={`flex-1 px-6 py-3 rounded-2xl font-semibold text-white transition-all ${
                        selectedPackage && !isProcessing
                          ? 'bg-gradient-to-r from-pink-400 to-pink-600 shadow-pink hover:shadow-xl'
                          : 'bg-pink-200 cursor-not-allowed'
                      }`}
                      whileHover={selectedPackage && !isProcessing ? { scale: 1.02 } : {}}
                      whileTap={selectedPackage && !isProcessing ? { scale: 0.98 } : {}}
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
                        `💳 Proceed to Paystack`
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
