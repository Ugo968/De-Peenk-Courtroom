import { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORY_EMOJIS } from '../lib/mock-data';
import type { CaseData } from '../lib/mock-data';

interface CJPrivateChamberProps {
  caseData: CaseData;
  onSubmitRuling: (caseId: string, ruling: string) => void;
  onExit: () => void;
}

export function CJPrivateChamber({ caseData, onSubmitRuling, onExit }: CJPrivateChamberProps) {
  const [ruling, setRuling] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!ruling.trim()) {
      alert('Please enter your royal ruling');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmitRuling(caseData.id, ruling);
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <div className="bg-gradient-to-br from-gold-100 via-pink-50 to-gold-100 rounded-3xl p-12 border-2 border-gold-300 shadow-gold text-center">
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="text-7xl mb-6 inline-block"
          >
            👑
          </motion.div>
          <h2 className="font-heading text-4xl font-bold text-gradient-gold mb-4">
            Justice Has Been Served
          </h2>
          <p className="text-pink-600 text-lg mb-6">
            Your royal ruling has been delivered with wisdom and grace ✨
          </p>
          <div className="bg-white/60 rounded-2xl p-4 border border-gold-200 mb-6">
            <p className="text-sm text-gold-700 font-medium">
              +400 virtual credits earned for resolving this case
            </p>
          </div>
          <motion.button
            onClick={onExit}
            className="px-8 py-4 rounded-3xl bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold shadow-pink hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return to Royal Court
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Royal Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4 inline-block"
        >
          🏛️
        </motion.div>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
          The Private Chamber
        </h2>
        <p className="text-pink-600/70 text-lg italic font-heading">
          Where wisdom meets justice ✨
        </p>
      </motion.div>

      {/* Case Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-gold-50 to-pink-50 rounded-3xl p-8 border-2 border-gold-200 shadow-gold mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{CATEGORY_EMOJIS[caseData.category]}</span>
            <div>
              <span className="px-3 py-1 rounded-full bg-gold-100 text-gold-700 text-xs font-bold border border-gold-300">
                👑 CJ HANDLING
              </span>
            </div>
          </div>
          <span className="text-xs text-pink-400">Filed {caseData.createdAt}</span>
        </div>

        <h3 className="font-heading text-2xl font-bold text-pink-800 mb-3">
          {caseData.title}
        </h3>

        <p className="text-pink-600/70 mb-4 leading-relaxed">
          {caseData.description}
        </p>

        <div className="flex items-center gap-4 pt-4 border-t border-gold-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-pink-500">Plaintiff:</span>
            <span className="font-mono text-xs bg-pink-50 px-2 py-1 rounded-lg text-pink-600 border border-pink-100">
              {caseData.plaintiffHandle}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-pink-500">💬 Testimonies:</span>
            <span className="text-sm font-bold text-pink-700">{caseData.testimonyCount}</span>
          </div>
        </div>
      </motion.div>

      {/* Ruling Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-pink-200 shadow-pink"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">⚖️</span>
          <h3 className="font-heading text-2xl font-bold text-pink-700">
            Deliver Your Royal Ruling
          </h3>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-pink-700 mb-3">
            Your Wisdom & Judgment <span className="text-pink-400">*</span>
          </label>
          <textarea
            value={ruling}
            onChange={(e) => setRuling(e.target.value)}
            placeholder="Speak your truth with compassion and clarity. Your words carry the weight of justice..."
            rows={10}
            className="w-full px-5 py-4 rounded-2xl border-2 border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-transparent resize-none font-heading text-lg leading-relaxed"
          />
          <p className="text-xs text-pink-400 mt-2 italic">
            Remember: Your ruling is final and will bring resolution to this sister's journey 💖
          </p>
        </div>

        {/* Guidance */}
        <div className="bg-gradient-to-r from-gold-50 to-pink-50 rounded-2xl p-5 border border-gold-200 mb-6">
          <h4 className="font-heading text-sm font-bold text-gold-700 mb-3 flex items-center gap-2">
            <span>👑</span> Royal Guidance
          </h4>
          <ul className="space-y-2 text-sm text-pink-600">
            <li className="flex items-start gap-2">
              <span className="text-gold-500 mt-0.5">✨</span>
              <span>Be compassionate yet firm in your judgment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 mt-0.5">✨</span>
              <span>Consider all testimonies and evidence presented</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 mt-0.5">✨</span>
              <span>Provide actionable advice for moving forward</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 mt-0.5">✨</span>
              <span>Your ruling will be shared with the plaintiff only</span>
            </li>
          </ul>
        </div>

        {/* Reward Info */}
        <div className="bg-gold-50 rounded-2xl p-4 border border-gold-200 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-medium text-gold-700">Royal Reward</p>
              <p className="text-sm text-gold-700/70">
                +400 virtual credits upon delivering your ruling
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            onClick={onExit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-4 rounded-3xl border-2 border-pink-200 text-pink-600 font-semibold hover:bg-pink-50 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Exit Chamber
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            disabled={!ruling.trim() || isSubmitting}
            className={`flex-1 px-6 py-4 rounded-3xl font-semibold text-white transition-all ${
              ruling.trim() && !isSubmitting
                ? 'bg-gradient-to-r from-gold-400 to-gold-500 shadow-gold hover:shadow-xl'
                : 'bg-gold-200 cursor-not-allowed'
            }`}
            whileHover={ruling.trim() && !isSubmitting ? { scale: 1.02 } : {}}
            whileTap={ruling.trim() && !isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Delivering Ruling...
              </span>
            ) : (
              '👑 Deliver Royal Ruling'
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Royal Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="font-heading text-sm italic text-pink-400">
          "With great power comes great responsibility" ✨
        </p>
      </motion.div>
    </div>
  );
}
