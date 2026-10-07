import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockCases, CATEGORY_EMOJIS, STATUS_COLORS, STATUS_LABELS } from '../lib/mock-data';
import type { CaseCategory, CaseStatus } from '../lib/mock-data';

const categories: (CaseCategory | 'ALL')[] = ['ALL', 'RELATIONSHIPS', 'MARRIAGE', 'FAMILY', 'GIRL_SAFETY', 'EDUCATION_CAREER', 'MOTHERHOOD', 'OTHERS'];

export function CasesBoard() {
  const [selectedCategory, setSelectedCategory] = useState<CaseCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | 'ALL'>('ALL');

  const filteredCases = mockCases.filter((c) => {
    const catMatch = selectedCategory === 'ALL' || c.category === selectedCategory;
    const statusMatch = selectedStatus === 'ALL' || c.status === selectedStatus;
    return catMatch && statusMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-pink mb-4">
          ⚖️ Cases Board
        </h2>
        <p className="text-pink-600/70 text-lg">
          Browse active cases. Every voice matters. 💖
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-pink'
                  : 'bg-white/60 text-pink-600 border border-pink-200 hover:bg-pink-50'
              }`}
            >
              {cat === 'ALL' ? '🌸 All' : `${CATEGORY_EMOJIS[cat]} ${cat.replace('_', ' ')}`}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedStatus === 'ALL'
                ? 'bg-sky-400 text-white'
                : 'bg-white/60 text-sky-600 border border-sky-200'
            }`}
          >
            All Status
          </button>
          {(['OPEN', 'CJ_REVIEW', 'CJ_ASSIGNED', 'CJ_HANDLING', 'DELIBERATING', 'RESOLVED'] as CaseStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedStatus === status
                  ? 'bg-sky-400 text-white'
                  : 'bg-white/60 text-sky-600 border border-sky-200'
              }`}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Cases Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem, i) => (
          <motion.div
            key={caseItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-sm hover:shadow-pink transition-all cursor-pointer"
          >
            {/* Category & Status */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{CATEGORY_EMOJIS[caseItem.category]}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[caseItem.status]}`}>
                {STATUS_LABELS[caseItem.status]}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-heading text-lg font-bold text-pink-800 mb-2 line-clamp-2">
              {caseItem.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-pink-600/60 mb-4 line-clamp-3">
              {caseItem.description}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-pink-500">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-pink-50 font-mono text-pink-600">
                  {caseItem.plaintiffHandle}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>💬 {caseItem.testimonyCount}</span>
                <span>🔥 Urgency: {caseItem.urgency}/5</span>
              </div>
            </div>

            {/* Chief Judge */}
            {caseItem.chiefJudgeHandle && (
              <div className="mt-3 pt-3 border-t border-pink-100">
                <div className="flex items-center gap-2">
                  <span className="text-gold-500">👑</span>
                  <span className="text-xs font-mono text-gold-700 bg-gold-50 px-2 py-1 rounded-lg">
                    {caseItem.chiefJudgeHandle}
                  </span>
                  <span className="text-xs text-pink-400">Presiding</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-pink-500 text-lg">No cases match your filters</p>
        </div>
      )}
    </div>
  );
}
