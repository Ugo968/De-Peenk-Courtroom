import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getActiveAds, getDaysRemaining } from '../lib/ads';
import type { Ad } from '../lib/ads';

export function SidebarAds() {
  const [flyers, setFlyers] = useState<Ad[]>([]);
  const [posters, setPosters] = useState<Ad[]>([]);

  useEffect(() => {
    // Get active FLYER and POSTER tier ads
    setFlyers(getActiveAds('FLYER'));
    setPosters(getActiveAds('POSTER'));
  }, []);

  if (flyers.length === 0 && posters.length === 0) return null;

  return (
    <aside className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-2">
        <span className="text-lg">📢</span>
        <h3 className="font-heading text-sm font-bold text-pink-700">Sponsored</h3>
      </div>

      {/* Poster Ads (larger) */}
      {posters.map((ad, i) => {
        const daysLeft = getDaysRemaining(ad.expiresAt);
        return (
          <motion.a
            key={ad.id}
            href={ad.linkUrl || '#'}
            target="_blank"
            rel="noopener noreferrer sponsored"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="block bg-gradient-to-br from-sky-50 to-pink-50 rounded-2xl border border-sky-200 overflow-hidden hover:shadow-md transition-all"
          >
            {ad.imageUrl && (
              <div className="aspect-[4/1] bg-gradient-to-r from-sky-100 to-pink-100 flex items-center justify-center overflow-hidden">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="p-3">
              <p className="font-medium text-sm text-pink-700 line-clamp-2">
                {ad.title}
              </p>
              <p className="text-xs text-pink-500 mt-1 line-clamp-2">
                {ad.content}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-sky-600 font-medium">
                  {ad.brandName}
                </span>
                <span className="text-xs text-pink-400">
                  {daysLeft}d left
                </span>
              </div>
            </div>
          </motion.a>
        );
      })}

      {/* Flyer Ads (smaller) */}
      {flyers.map((ad, i) => {
        const daysLeft = getDaysRemaining(ad.expiresAt);
        return (
          <motion.a
            key={ad.id}
            href={ad.linkUrl || '#'}
            target="_blank"
            rel="noopener noreferrer sponsored"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (posters.length + i) * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="block bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-3 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">📄</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs text-pink-700 line-clamp-2">
                  {ad.title}
                </p>
                <p className="text-xs text-pink-500 mt-1 line-clamp-2">
                  {ad.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-pink-400">
                    {ad.brandName}
                  </span>
                  <span className="text-xs text-pink-400">
                    {daysLeft}d
                  </span>
                </div>
              </div>
            </div>
          </motion.a>
        );
      })}

      {/* Advertise CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-gold-50 to-pink-50 rounded-2xl border border-gold-200 p-4 text-center"
      >
        <p className="text-xs text-gold-700 font-medium mb-2">
          📢 Advertise with us!
        </p>
        <p className="text-xs text-pink-500 mb-3">
          Reach thousands of engaged women
        </p>
        <a
          href="#brand-dashboard"
          className="inline-block px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 text-white text-xs font-medium hover:shadow-md transition-all"
        >
          Start Advertising
        </a>
      </motion.div>
    </aside>
  );
}
