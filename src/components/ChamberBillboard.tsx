import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getActiveAds, getDaysRemaining } from '../lib/ads';
import type { Ad } from '../lib/ads';

export function ChamberBillboard() {
  const [billboards, setBillboards] = useState<Ad[]>([]);

  useEffect(() => {
    // Get active BILLBOARD tier ads
    setBillboards(getActiveAds('BILLBOARD'));
  }, []);

  if (billboards.length === 0) return null;

  const billboard = billboards[0]; // Show first billboard
  const daysLeft = getDaysRemaining(billboard.expiresAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 bg-gradient-to-br from-gold-50 via-pink-50 to-gold-50 rounded-3xl border-2 border-gold-300 shadow-gold overflow-hidden"
    >
      {/* Royal Header */}
      <div className="bg-gradient-to-r from-gold-200 via-gold-100 to-gold-200 px-4 py-2 border-b border-gold-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">👑</span>
            <span className="text-xs font-bold text-gold-700">Royal Sponsor</span>
          </div>
          <span className="text-xs text-gold-600">{daysLeft} days left</span>
        </div>
      </div>

      {/* Billboard Content */}
      <a
        href={billboard.linkUrl || '#'}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block p-6 hover:bg-gold-50/50 transition-colors"
      >
        {billboard.imageUrl && (
          <div className="mb-4 rounded-2xl overflow-hidden border border-gold-200">
            <img
              src={billboard.imageUrl}
              alt={billboard.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        <h3 className="font-heading text-xl font-bold text-gold-700 mb-2">
          {billboard.title}
        </h3>
        
        <p className="text-sm text-pink-600/80 leading-relaxed mb-4">
          {billboard.content}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gold-700">
            {billboard.brandName}
          </span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 text-white text-sm font-medium shadow-gold"
          >
            Visit Now →
          </motion.span>
        </div>
      </a>

      {/* Decorative Footer */}
      <div className="bg-gold-100/50 px-4 py-2 border-t border-gold-200">
        <p className="text-xs text-gold-600 text-center italic">
          ✨ Premium placement in the Chief Judge's Chamber ✨
        </p>
      </div>
    </motion.div>
  );
}
