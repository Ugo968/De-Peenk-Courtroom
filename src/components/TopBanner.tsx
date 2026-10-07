import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveAds, getDaysRemaining } from '../lib/ads';
import type { Ad } from '../lib/ads';

export function TopBanner() {
  const [banners, setBanners] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Get active BANNER tier ads (Header/Footer Sticky)
    const activeBanners = getActiveAds('BANNER');
    setBanners(activeBanners);
  }, []);

  // Auto-rotate banners every 8 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];
  const daysLeft = getDaysRemaining(currentBanner.expiresAt);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-16 z-40 bg-gradient-to-r from-gold-100 via-pink-50 to-gold-100 border-b border-gold-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-lg">🚩</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-pink-700 text-sm truncate">
                  {currentBanner.title}
                </p>
                <p className="text-xs text-pink-500 truncate">
                  {currentBanner.content}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gold-700 font-medium whitespace-nowrap">
                {daysLeft}d left
              </span>
              {currentBanner.linkUrl && (
                <a
                  href={currentBanner.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs font-medium hover:shadow-md transition-all whitespace-nowrap"
                >
                  Learn More →
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
