import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockCases, CATEGORY_EMOJIS, STATUS_COLORS, STATUS_LABELS } from '../lib/mock-data';
import type { CaseData, CaseStatus } from '../lib/mock-data';

interface LawyerDashboardProps {
  virtualCredits: number;
  casesWon: number;
  level: number;
  onResolveCase: (caseId: string, verdict: string) => void;
}

export function LawyerDashboard({ virtualCredits, casesWon, level, onResolveCase }: LawyerDashboardProps) {
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [verdict, setVerdict] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter cases: OPEN or CJ_ASSIGNED (cases delegated by Chief Judge)
  const availableCases = mockCases.filter(
    (c) => c.status === 'OPEN' || c.status === 'CJ_ASSIGNED'
  );

  const progressToNextLevel = ((virtualCredits % 1000) / 1000) * 100;

  const handleResolve = async (caseId: string) => {
    if (!verdict.trim()) {
      alert('Please enter a verdict');
      return;
    }

    setIsResolving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Call parent handler
      onResolveCase(caseId, verdict);

      setShowSuccess(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setSelectedCase(null);
        setVerdict('');
        setShowSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Resolve error:', error);
      alert('Failed to resolve case. Please try again.');
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-pink mb-4">
          ⚖️ Lawyer Dashboard
        </h2>
        <p className="text-pink-600/70 text-lg">
          Review cases, provide counsel, and build your reputation
        </p>
      </motion.div>

      {/* Virtual Wallet Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-pink-100 via-pink-50 to-sky-100 rounded-3xl p-8 border border-pink-200 shadow-pink mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading text-2xl font-bold text-pink-800 mb-1">
              Your Virtual Wallet
            </h3>
            <p className="text-sm text-pink-600/70">
              Gamified reputation score (NOT real money)
            </p>
          </div>
          <div className="text-5xl">⚖️</div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Virtual Credits */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-pink-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💎</span>
              <span className="text-sm font-medium text-pink-600">Virtual Credits</span>
            </div>
            <div className="font-heading text-4xl font-bold text-pink-700 mb-1">
              {virtualCredits.toLocaleString()}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-pink-600 mb-1">
                <span>Level {level}</span>
                <span>Level {level + 1}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-pink-200/50">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Cases Won */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-sky-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏆</span>
              <span className="text-sm font-medium text-sky-600">Cases Won</span>
            </div>
            <div className="font-heading text-4xl font-bold text-sky-700">
              {casesWon}
            </div>
            <p className="text-xs text-sky-600/70 mt-2">
              +400 credits per win
            </p>
          </div>

          {/* Reputation */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-gold-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👑</span>
              <span className="text-sm font-medium text-gold-700">Reputation</span>
            </div>
            <div className="font-heading text-4xl font-bold text-gold-700">
              {Math.floor(virtualCredits / 100) + casesWon * 50}
            </div>
            <p className="text-xs text-gold-700/70 mt-2">
              Based on wins & credits
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/40 rounded-2xl border border-pink-100">
          <p className="text-sm text-pink-600 text-center">
            ⚠️ <strong>Note:</strong> Virtual credits are purely for gamification and leaderboards. 
            They do NOT represent real money and cannot be withdrawn.
          </p>
        </div>
      </motion.div>

      {/* Available Cases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-heading text-2xl font-bold text-pink-700 mb-6 flex items-center gap-2">
          📋 Available Cases
          <span className="text-sm font-normal text-pink-500">
            ({availableCases.length} cases)
          </span>
        </h3>

        {availableCases.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-pink-100 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-pink-600 text-lg">No cases available at the moment</p>
            <p className="text-pink-400 text-sm mt-2">Check back later for new cases</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {availableCases.map((caseItem, i) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-sm hover:shadow-pink transition-all cursor-pointer"
                onClick={() => setSelectedCase(caseItem)}
              >
                {/* Category & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{CATEGORY_EMOJIS[caseItem.category]}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[caseItem.status]}`}>
                    {STATUS_LABELS[caseItem.status]}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-heading text-lg font-bold text-pink-800 mb-2 line-clamp-2">
                  {caseItem.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-pink-600/60 mb-4 line-clamp-3">
                  {caseItem.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-pink-500">
                  <span className="font-mono bg-pink-50 px-2 py-1 rounded-lg text-pink-600">
                    {caseItem.plaintiffHandle}
                  </span>
                  <div className="flex items-center gap-3">
                    <span>💬 {caseItem.testimonyCount} testimonies</span>
                    <span>🔥 Urgency: {caseItem.urgency}/5</span>
                  </div>
                </div>

                {/* CJ Delegated Badge */}
                {caseItem.status === 'CJ_ASSIGNED' && (
                  <div className="mt-3 pt-3 border-t border-pink-100">
                    <div className="flex items-center gap-2">
                      <span className="text-gold-500">👑</span>
                      <span className="text-xs text-gold-700 font-medium">
                        Delegated by Chief Judge
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Resolve Case Modal */}
      {selectedCase && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => !isResolving && setSelectedCase(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto border border-pink-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-100 to-sky-100 p-6 border-b border-pink-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-pink-700">
                      ⚖️ Resolve Case
                    </h3>
                    <p className="text-sm text-pink-600/70 mt-1">
                      Submit your final verdict
                    </p>
                  </div>
                  <button
                    onClick={() => !isResolving && setSelectedCase(null)}
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
                    <h4 className="font-heading text-2xl font-bold text-gradient-pink mb-2">
                      Case Resolved!
                    </h4>
                    <p className="text-pink-600">
                      You earned <span className="font-bold text-pink-700">+400 virtual credits</span>
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Case Details */}
                    <div className="bg-pink-50 rounded-2xl p-5 border border-pink-100 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{CATEGORY_EMOJIS[selectedCase.category]}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[selectedCase.status]}`}>
                          {STATUS_LABELS[selectedCase.status]}
                        </span>
                      </div>
                      <h4 className="font-heading text-lg font-bold text-pink-800 mb-2">
                        {selectedCase.title}
                      </h4>
                      <p className="text-sm text-pink-600/70 mb-3">
                        {selectedCase.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-pink-500">
                        <span>Plaintiff: {selectedCase.plaintiffHandle}</span>
                        <span>💬 {selectedCase.testimonyCount} testimonies</span>
                      </div>
                    </div>

                    {/* Verdict Input */}
                    <div>
                      <label className="block text-sm font-medium text-pink-700 mb-2">
                        Your Verdict <span className="text-pink-400">*</span>
                      </label>
                      <textarea
                        value={verdict}
                        onChange={(e) => setVerdict(e.target.value)}
                        placeholder="Provide your final ruling, advice, or resolution..."
                        rows={6}
                        className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-pink-400 mt-1">
                        Be clear, compassionate, and constructive in your ruling.
                      </p>
                    </div>

                    {/* Reward Info */}
                    <div className="mt-4 bg-gold-50 rounded-2xl p-4 border border-gold-200">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🏆</span>
                        <div>
                          <p className="font-medium text-gold-700">Reward</p>
                          <p className="text-sm text-gold-700/70">
                            +400 virtual lawyer credits upon resolution
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              {!showSuccess && (
                <div className="p-6 border-t border-pink-100 bg-pink-50/50">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedCase(null)}
                      disabled={isResolving}
                      className="flex-1 px-6 py-3 rounded-2xl border-2 border-pink-200 text-pink-600 font-medium hover:bg-pink-100 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={() => handleResolve(selectedCase.id)}
                      disabled={!verdict.trim() || isResolving}
                      className={`flex-1 px-6 py-3 rounded-2xl font-semibold text-white transition-all ${
                        verdict.trim() && !isResolving
                          ? 'bg-gradient-to-r from-pink-400 to-pink-600 shadow-pink hover:shadow-xl'
                          : 'bg-pink-200 cursor-not-allowed'
                      }`}
                      whileHover={verdict.trim() && !isResolving ? { scale: 1.02 } : {}}
                      whileTap={verdict.trim() && !isResolving ? { scale: 0.98 } : {}}
                    >
                      {isResolving ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Resolving...
                        </span>
                      ) : (
                        '⚖️ Submit Verdict'
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
