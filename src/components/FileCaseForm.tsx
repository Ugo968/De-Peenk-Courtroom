import { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORY_EMOJIS } from '../lib/mock-data';
import type { CaseCategory } from '../lib/mock-data';

interface FileCaseFormProps {
  onSubmit: (data: { title: string; description: string; category: CaseCategory }) => void;
  currentCredits: number;
}

const FILING_COST = 300;

const categories: { value: CaseCategory; label: string; emoji: string }[] = [
  { value: 'RELATIONSHIPS', label: 'Relationships', emoji: '💕' },
  { value: 'MARRIAGE', label: 'Marriage', emoji: '💍' },
  { value: 'FAMILY', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { value: 'GIRL_SAFETY', label: 'Girl Safety', emoji: '🛡️' },
  { value: 'EDUCATION_CAREER', label: 'Education & Career', emoji: '📚' },
  { value: 'MOTHERHOOD', label: 'Motherhood', emoji: '🤱' },
  { value: 'OTHERS', label: 'Others', emoji: '✨' },
];

export function FileCaseForm({ onSubmit, currentCredits }: FileCaseFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CaseCategory | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [routingNote, setRoutingNote] = useState('');

  const canAfford = currentCredits >= FILING_COST;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category) {
      alert('Please fill in all fields');
      return;
    }

    if (!canAfford) {
      alert(`Insufficient credits. You need ${FILING_COST} credits to file a case.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Determine routing note
      const note = category === 'RELATIONSHIPS'
        ? '👑 This case has been routed to the Chief Judge for private review'
        : '⚖️ This case is now open for lawyers to handle';

      setRoutingNote(note);
      setShowSuccess(true);

      // Call parent onSubmit
      onSubmit({
        title,
        description,
        category: category as CaseCategory,
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setCategory('');
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Filing error:', error);
      alert('Failed to file case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl mx-auto px-4 py-12"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-pink-100 shadow-pink text-center">
          <div className="text-6xl mb-4 animate-float">🎉</div>
          <h2 className="font-heading text-3xl font-bold text-gradient-pink mb-4">
            Case Filed Successfully!
          </h2>
          <p className="text-pink-600 mb-4">
            {FILING_COST} credits have been deducted from your wallet
          </p>
          <div className="bg-pink-50 rounded-2xl p-4 border border-pink-200">
            <p className="text-sm text-pink-700 font-medium">{routingNote}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-pink mb-4">
          🎀 File a New Case
        </h2>
        <p className="text-pink-600/70 text-lg">
          Share your story. We're here to listen and help. 💖
        </p>
      </motion.div>

      {/* Credits Warning */}
      {!canAfford && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-medium text-red-700">Insufficient Credits</p>
              <p className="text-sm text-red-600">
                You need {FILING_COST} credits to file a case. Current balance: {currentCredits} credits
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-pink space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-pink-700 mb-2">
            Case Title <span className="text-pink-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief summary of your situation"
            className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-pink-700 mb-2">
            Category <span className="text-pink-400">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  category === cat.value
                    ? 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-400 shadow-sm'
                    : 'bg-pink-50/50 border-pink-100 hover:border-pink-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <div className="text-sm font-medium text-pink-700">{cat.label}</div>
              </motion.button>
            ))}
          </div>

          {/* Special Note for RELATIONSHIPS */}
          {category === 'RELATIONSHIPS' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 bg-gold-50 border border-gold-200 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">👑</span>
                <div>
                  <p className="font-medium text-gold-700 mb-1">Chief Judge Review</p>
                  <p className="text-sm text-gold-700/70">
                    Relationship cases are handled directly by the Chief Judge in a private, confidential review process. 
                    They bypass the lawyers queue for more sensitive handling.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-pink-700 mb-2">
            Detailed Description <span className="text-pink-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us what happened. The more details you provide, the better we can help..."
            rows={8}
            className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
            required
          />
          <p className="text-xs text-pink-400 mt-1">
            Your identity will be protected. Only your anonymous handle will be visible.
          </p>
        </div>

        {/* Cost Info */}
        <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-700">Filing Cost</p>
              <p className="text-xs text-pink-500">Deducted from your wallet</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-pink-600">{FILING_COST}</p>
              <p className="text-xs text-pink-400">credits</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!title || !description || !category || !canAfford || isSubmitting}
          className={`w-full px-6 py-4 rounded-3xl font-semibold text-lg transition-all ${
            title && description && category && canAfford && !isSubmitting
              ? 'bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-pink hover:shadow-xl'
              : 'bg-pink-200 text-pink-400 cursor-not-allowed'
          }`}
          whileHover={title && description && category && canAfford && !isSubmitting ? { scale: 1.02 } : {}}
          whileTap={title && description && category && canAfford && !isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Filing Your Case...
            </span>
          ) : (
            '🎀 File Case'
          )}
        </motion.button>

        {/* Privacy Notice */}
        <p className="text-center text-xs text-pink-400">
          🔒 Your identity is encrypted and protected. Only your anonymous handle will be visible.
        </p>
      </motion.form>
    </div>
  );
}
