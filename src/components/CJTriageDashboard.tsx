import { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORY_EMOJIS } from '../lib/mock-data';
import type { CaseData } from '../lib/mock-data';

interface CJTriageDashboardProps {
  cases: CaseData[];
  onTriage: (caseId: string, action: 'HANDLE_MYSELF' | 'ASSIGN_TO_LAWYERS') => void;
  onEnterChamber: (caseId: string) => void;
}

export function CJTriageDashboard({ cases, onTriage, onEnterChamber }: CJTriageDashboardProps) {
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Only show CJ_REVIEW cases (Relationship cases)
  const triageQueue = cases.filter(c => c.status === 'CJ_REVIEW');
  const handlingCases = cases.filter(c => c.status === 'CJ_HANDLING');

  const handleTriage = async (caseId: string, action: 'HANDLE_MYSELF' | 'ASSIGN_TO_LAWYERS') => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onTriage(caseId, action);
      setSelectedCase(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Royal Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-6xl mb-4 inline-block"
        >
          👑
        </motion.div>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
          Chief Judge's Court
        </h2>
        <p className="text-pink-600/70 text-lg italic font-heading">
          "Wisdom, Grace & Justice" ✨
        </p>
      </motion.div>

      {/* Royal Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-gradient-to-br from-gold-100 to-gold-200 rounded-3xl p-6 border border-gold-300 shadow-gold">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📋</span>
            <span className="text-sm font-medium text-gold-700">Triage Queue</span>
          </div>
          <div className="font-heading text-4xl font-bold text-gold-700">
            {triageQueue.length}
          </div>
          <p className="text-xs text-gold-700/70 mt-1">Cases awaiting your review</p>
        </div>

        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-6 border border-pink-300 shadow-pink">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚖️</span>
            <span className="text-sm font-medium text-pink-700">In Chamber</span>
          </div>
          <div className="font-heading text-4xl font-bold text-pink-700">
            {handlingCases.length}
          </div>
          <p className="text-xs text-pink-700/70 mt-1">Cases you're handling personally</p>
        </div>

        <div className="bg-gradient-to-br from-sky-100 to-sky-200 rounded-3xl p-6 border border-sky-300">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏆</span>
            <span className="text-sm font-medium text-sky-700">Royal Authority</span>
          </div>
          <div className="font-heading text-4xl font-bold text-sky-700">
            Supreme
          </div>
          <p className="text-xs text-sky-700/70 mt-1">Final word in all matters</p>
        </div>
      </motion.div>

      {/* Triage Queue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">📋</span>
          <h3 className="font-heading text-2xl font-bold text-gold-700">
            Royal Triage Queue
          </h3>
          <span className="px-3 py-1 rounded-full bg-gold-100 text-gold-700 text-sm font-medium border border-gold-300">
            {triageQueue.length} pending
          </span>
        </div>

        {triageQueue.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-gold-200 text-center">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-gold-700 text-lg font-heading">All caught up, Your Majesty!</p>
            <p className="text-pink-500 text-sm mt-2">No cases awaiting your royal review</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {triageQueue.map((caseItem, i) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-white/90 to-gold-50/50 rounded-3xl p-6 border-2 border-gold-200 shadow-sm hover:shadow-gold transition-all"
              >
                {/* Royal Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{CATEGORY_EMOJIS[caseItem.category]}</span>
                    <span className="px-3 py-1 rounded-full bg-gold-100 text-gold-700 text-xs font-bold border border-gold-300">
                      👑 CJ REVIEW
                    </span>
                  </div>
                  <span className="text-xs text-pink-400">
                    Filed {caseItem.createdAt}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-heading text-lg font-bold text-pink-800 mb-2">
                  {caseItem.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-pink-600/60 mb-4 line-clamp-3">
                  {caseItem.description}
                </p>

                {/* Plaintiff Handle */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-pink-500">Plaintiff:</span>
                  <span className="font-mono text-xs bg-pink-50 px-2 py-1 rounded-lg text-pink-600 border border-pink-100">
                    {caseItem.plaintiffHandle}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => handleTriage(caseItem.id, 'HANDLE_MYSELF')}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold text-sm shadow-gold hover:shadow-xl transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    👑 Handle Myself
                  </motion.button>
                  <motion.button
                    onClick={() => handleTriage(caseItem.id, 'ASSIGN_TO_LAWYERS')}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 rounded-2xl bg-white border-2 border-pink-200 text-pink-600 font-semibold text-sm hover:bg-pink-50 transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ⚖️ Assign to Lawyers
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Cases In Chamber */}
      {handlingCases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🏛️</span>
            <h3 className="font-heading text-2xl font-bold text-pink-700">
              In Your Private Chamber
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {handlingCases.map((caseItem, i) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-pink-50 to-gold-50 rounded-3xl p-6 border-2 border-pink-200 shadow-pink"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{CATEGORY_EMOJIS[caseItem.category]}</span>
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold border border-pink-300">
                    🏛️ IN CHAMBER
                  </span>
                </div>

                <h4 className="font-heading text-lg font-bold text-pink-800 mb-2">
                  {caseItem.title}
                </h4>

                <p className="text-sm text-pink-600/60 mb-4 line-clamp-2">
                  {caseItem.description}
                </p>

                <motion.button
                  onClick={() => onEnterChamber(caseItem.id)}
                  className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold text-sm shadow-pink hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🏛️ Enter Private Chamber
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Royal Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <div className="bg-gradient-to-r from-gold-100 via-pink-50 to-gold-100 rounded-3xl p-6 border border-gold-200">
          <p className="font-heading text-lg italic text-gold-700">
            "In wisdom, we find justice. In grace, we find peace." 👑✨
          </p>
        </div>
      </motion.div>
    </div>
  );
}
