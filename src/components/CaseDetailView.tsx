import { useState } from 'react';
import { motion } from 'framer-motion';
import { GalleryTalk } from './GalleryTalk';
import { mockCases, mockTestimonies, CATEGORY_EMOJIS, STATUS_COLORS, STATUS_LABELS } from '../lib/mock-data';
import type { CaseData } from '../lib/mock-data';

interface CaseDetailViewProps {
  caseId: string;
  userRole: string;
  userHandle: string;
}

export function CaseDetailView({ caseId, userRole, userHandle }: CaseDetailViewProps) {
  const caseData = mockCases.find(c => c.id === caseId);
  const caseTestimonies = mockTestimonies.filter(t => t.caseId === caseId);

  if (!caseData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-pink-600 text-lg">Case not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Case Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-pink mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{CATEGORY_EMOJIS[caseData.category]}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[caseData.status]}`}>
              {STATUS_LABELS[caseData.status]}
            </span>
          </div>
          <span className="text-xs text-pink-400">Filed {caseData.createdAt}</span>
        </div>

        <h2 className="font-heading text-3xl font-bold text-pink-800 mb-4">
          {caseData.title}
        </h2>

        <p className="text-pink-600/70 leading-relaxed mb-6">
          {caseData.description}
        </p>

        <div className="flex items-center gap-6 pt-4 border-t border-pink-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-pink-500">Plaintiff:</span>
            <span className="font-mono text-sm bg-pink-50 px-2 py-1 rounded-lg text-pink-600 border border-pink-100">
              {caseData.plaintiffHandle}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-pink-500">💬 Testimonies:</span>
            <span className="text-sm font-bold text-pink-700">{caseData.testimonyCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-pink-500">🔥 Urgency:</span>
            <span className="text-sm font-bold text-pink-700">{caseData.urgency}/5</span>
          </div>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Testimonies */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-heading text-2xl font-bold text-pink-700 mb-4 flex items-center gap-2">
            💬 Testimonies
          </h3>
          <div className="space-y-4">
            {caseTestimonies.length === 0 ? (
              <div className="bg-white/60 rounded-2xl p-8 border border-pink-100 text-center">
                <p className="text-pink-500">No testimonies yet</p>
              </div>
            ) : (
              caseTestimonies.map((testimony, i) => (
                <motion.div
                  key={testimony.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="bg-white/80 rounded-2xl p-5 border border-pink-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-lg">
                      {testimony.authorHandle}
                    </span>
                    <span className="text-xs text-pink-400">❤️ {testimony.likes}</span>
                  </div>
                  <p className="text-sm text-pink-700 leading-relaxed">
                    {testimony.content}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Gallery Talk */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GalleryTalk
            caseId={caseId}
            userRole={userRole}
            userHandle={userHandle}
          />
        </motion.div>
      </div>
    </div>
  );
}
