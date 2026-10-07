import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  mockCJSlots, 
  RELIGION_INFO, 
  getDaysRemaining, 
  getHoursRemaining,
  getQueueWaitEstimate,
  CJ_TENURE_DAYS,
  CJ_PRICE_NAIRA,
} from '../lib/cj-slots';
import type { Religion, CJSlot } from '../lib/cj-slots';

export function CJSlotSystem() {
  const [selectedReligion, setSelectedReligion] = useState<Religion | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    status: 'IMMEDIATE' | 'QUEUED';
    queuePosition?: number;
    estimatedWaitDays?: number;
  } | null>(null);

  const handlePurchaseClick = (religion: Religion) => {
    setSelectedReligion(religion);
    setShowPurchaseModal(true);
    setPurchaseResult(null);
  };

  const handlePurchase = async () => {
    if (!selectedReligion) return;

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate response based on slot availability
      const slot = mockCJSlots.find(s => s.religion === selectedReligion);
      
      if (slot?.currentHolder) {
        // Slot occupied - add to queue
        setPurchaseResult({
          status: 'QUEUED',
          queuePosition: (slot.queue.length + 1),
          estimatedWaitDays: (slot.queue.length + 1) * CJ_TENURE_DAYS,
        });
      } else {
        // Slot available - immediate access
        setPurchaseResult({
          status: 'IMMEDIATE',
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="text-6xl mb-4">👑</div>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
          Chief Judge Slots
        </h2>
        <p className="text-pink-600/70 text-lg max-w-2xl mx-auto">
          Only 2 CJ slots available: 1 Muslim, 1 Christian. Each tenure lasts {CJ_TENURE_DAYS} days.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-50 border border-gold-200">
          <span className="text-sm text-gold-700 font-medium">
            💰 Price: ₦{CJ_PRICE_NAIRA.toLocaleString()} per tenure
          </span>
        </div>
      </motion.div>

      {/* Slots Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {mockCJSlots.map((slot, i) => {
          const religionInfo = RELIGION_INFO[slot.religion];
          const daysLeft = slot.currentHolder 
            ? getDaysRemaining(slot.currentHolder.expiresAt) 
            : 0;
          const hoursLeft = slot.currentHolder 
            ? getHoursRemaining(slot.currentHolder.expiresAt) 
            : 0;

          return (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${religionInfo.color} rounded-3xl p-8 border-2 border-white/50 shadow-lg`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{religionInfo.emoji}</span>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-pink-800">
                      {religionInfo.label}
                    </h3>
                    <p className="text-xs text-pink-600/70">
                      {religionInfo.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-pink-500">Status</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    slot.currentHolder 
                      ? 'bg-pink-200 text-pink-700' 
                      : 'bg-green-200 text-green-700'
                  }`}>
                    {slot.currentHolder ? 'Active' : 'Available'}
                  </div>
                </div>
              </div>

              {/* Current Holder */}
              {slot.currentHolder && (
                <div className="bg-white/60 rounded-2xl p-4 mb-4 border border-white/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-pink-600">Current CJ</span>
                    <span className="text-xs text-pink-500">
                      Expires in {daysLeft}d {hoursLeft % 24}h
                    </span>
                  </div>
                  <div className="font-mono text-sm font-bold text-pink-700 mb-2">
                    {slot.currentHolder.anonymousHandle}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-pink-600">
                    <span>⚖️ {slot.currentHolder.casesHandled} cases</span>
                    <span>🏆 {slot.currentHolder.reputationScore} rep</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full h-2 rounded-full bg-pink-200/50">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${((CJ_TENURE_DAYS - daysLeft) / CJ_TENURE_DAYS) * 100}%` 
                        }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Queue */}
              <div className="bg-white/40 rounded-2xl p-4 mb-4 border border-white/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-pink-700">
                    📋 Queue ({slot.queue.length})
                  </span>
                  {slot.queue.length > 0 && (
                    <span className="text-xs text-pink-500">
                      Next: ~{getQueueWaitEstimate(1)}
                    </span>
                  )}
                </div>
                
                {slot.queue.length === 0 ? (
                  <p className="text-xs text-pink-500 italic">No one in queue</p>
                ) : (
                  <div className="space-y-2">
                    {slot.queue.map((entry, idx) => (
                      <div 
                        key={entry.userId}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/50 border border-white/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center text-xs font-bold text-pink-700">
                            {entry.position}
                          </span>
                          <span className="font-mono text-xs text-pink-600">
                            {entry.anonymousHandle}
                          </span>
                        </div>
                        <span className="text-xs text-pink-400">
                          {getQueueWaitEstimate(entry.position)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Purchase Button */}
              <motion.button
                onClick={() => handlePurchaseClick(slot.religion)}
                className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold shadow-gold hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                👑 Become Chief Judge (₦{CJ_PRICE_NAIRA.toLocaleString()})
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-sm"
      >
        <h3 className="font-heading text-2xl font-bold text-pink-700 mb-6 text-center">
          📜 How CJ Slots Work
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '1', emoji: '📝', title: 'Register Religion', desc: 'Set your religion during signup (MUSLIM or CHRISTIAN)' },
            { step: '2', emoji: '💰', title: 'Pay ₦3,500', desc: 'Purchase a 14-day CJ slot for your religion' },
            { step: '3', emoji: '⏳', title: 'Wait or Start', desc: 'If slot available, start immediately. Otherwise, join queue.' },
            { step: '4', emoji: '👑', title: 'Preside', desc: 'Handle cases related to your religion for 14 days' },
          ].map((item, i) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-200 to-gold-300 flex items-center justify-center mx-auto mb-3 text-xl">
                {item.emoji}
              </div>
              <h4 className="font-heading font-bold text-pink-700 mb-1">{item.title}</h4>
              <p className="text-xs text-pink-600/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedReligion && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => !isProcessing && setShowPurchaseModal(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden pointer-events-auto border-2 border-gold-300">
              {/* Header */}
              <div className={`bg-gradient-to-r ${RELIGION_INFO[selectedReligion].color} p-6 border-b border-gold-200`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{RELIGION_INFO[selectedReligion].emoji}</span>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-pink-700">
                        {RELIGION_INFO[selectedReligion].label}
                      </h3>
                      <p className="text-sm text-pink-600/70">
                        14-day tenure
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => !isProcessing && setShowPurchaseModal(false)}
                    className="p-2 rounded-full hover:bg-white/50 transition-colors"
                  >
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {purchaseResult ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    {purchaseResult.status === 'IMMEDIATE' ? (
                      <>
                        <div className="text-6xl mb-4 animate-float">🎉</div>
                        <h4 className="font-heading text-2xl font-bold text-gradient-gold mb-2">
                          Congratulations!
                        </h4>
                        <p className="text-pink-600 mb-4">
                          You are now the Chief Judge for the next {CJ_TENURE_DAYS} days!
                        </p>
                        <div className="bg-gold-50 rounded-2xl p-4 border border-gold-200">
                          <p className="text-sm text-gold-700 font-medium">
                            Redirecting to your CJ Dashboard...
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-6xl mb-4">📋</div>
                        <h4 className="font-heading text-2xl font-bold text-pink-700 mb-2">
                          Added to Queue
                        </h4>
                        <p className="text-pink-600 mb-4">
                          The slot is currently occupied. You've been added to the queue.
                        </p>
                        <div className="bg-pink-50 rounded-2xl p-4 border border-pink-200 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-pink-600">Queue Position:</span>
                            <span className="font-bold text-pink-700">#{purchaseResult.queuePosition}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-pink-600">Estimated Wait:</span>
                            <span className="font-bold text-pink-700">
                              {getQueueWaitEstimate(purchaseResult.queuePosition!)}
                            </span>
                          </div>
                          <p className="text-xs text-pink-500 mt-2">
                            You'll be notified when it's your turn!
                          </p>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <>
                    <div className="bg-gold-50 rounded-2xl p-4 border border-gold-200 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gold-700">Price:</span>
                        <span className="font-bold text-xl text-gold-700">
                          ₦{CJ_PRICE_NAIRA.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gold-700">Duration:</span>
                        <span className="font-bold text-gold-700">{CJ_TENURE_DAYS} days</span>
                      </div>
                    </div>

                    <div className="bg-pink-50 rounded-2xl p-4 border border-pink-200 mb-4">
                      <h4 className="font-medium text-pink-700 mb-2">What You Get:</h4>
                      <ul className="space-y-1 text-sm text-pink-600">
                        <li className="flex items-center gap-2">
                          <span>✨</span> Access to CJ Triage Dashboard
                        </li>
                        <li className="flex items-center gap-2">
                          <span>✨</span> Private Chamber for rulings
                        </li>
                        <li className="flex items-center gap-2">
                          <span>✨</span> Handle cases in your religion
                        </li>
                        <li className="flex items-center gap-2">
                          <span>✨</span> +400 virtual credits per case
                        </li>
                      </ul>
                    </div>

                    <p className="text-xs text-pink-500 text-center mb-4">
                      Payment will be processed securely via Paystack
                    </p>
                  </>
                )}
              </div>

              {/* Footer */}
              {!purchaseResult && (
                <div className="p-6 border-t border-pink-100 bg-pink-50/50">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPurchaseModal(false)}
                      disabled={isProcessing}
                      className="flex-1 px-6 py-3 rounded-2xl border-2 border-pink-200 text-pink-600 font-medium hover:bg-pink-100 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handlePurchase}
                      disabled={isProcessing}
                      className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold shadow-gold hover:shadow-xl transition-all disabled:opacity-50"
                      whileHover={!isProcessing ? { scale: 1.02 } : {}}
                      whileTap={!isProcessing ? { scale: 0.98 } : {}}
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
                        `💳 Pay ₦${CJ_PRICE_NAIRA.toLocaleString()}`
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
