import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveAds } from '../lib/ads';
import type { Ad } from '../lib/ads';

export function VideoAdPopup() {
  const [showAd, setShowAd] = useState(false);
  const [videoAd, setVideoAd] = useState<Ad | null>(null);

  useEffect(() => {
    // Get active VIDEO tier ads
    const videoAds = getActiveAds('VIDEO');
    if (videoAds.length > 0) {
      setVideoAd(videoAds[0]);
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setShowAd(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowAd(false);
  };

  if (!videoAd) return null;

  return (
    <AnimatePresence>
      {showAd && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Video Ad Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden pointer-events-auto border-2 border-gold-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-gold-200 via-pink-100 to-gold-200 p-4 border-b border-gold-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎬</span>
                    <div>
                      <p className="font-bold text-pink-700 text-sm">Sponsored Video</p>
                      <p className="text-xs text-pink-500">{videoAd.brandName}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-pink-100 transition-colors"
                  >
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Video Content */}
              <div className="p-6">
                {videoAd.videoUrl ? (
                  <div className="aspect-video rounded-2xl overflow-hidden border border-pink-200 mb-4">
                    <video
                      src={videoAd.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : videoAd.imageUrl ? (
                  <div className="aspect-video rounded-2xl overflow-hidden border border-pink-200 mb-4">
                    <img
                      src={videoAd.imageUrl}
                      alt={videoAd.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}

                <h3 className="font-heading text-xl font-bold text-pink-700 mb-2">
                  {videoAd.title}
                </h3>

                <p className="text-sm text-pink-600/80 leading-relaxed mb-4">
                  {videoAd.content}
                </p>

                {videoAd.linkUrl && (
                  <a
                    href={videoAd.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold shadow-pink hover:shadow-xl transition-all"
                  >
                    Learn More →
                  </a>
                )}
              </div>

              {/* Footer */}
              <div className="bg-pink-50 px-6 py-3 border-t border-pink-100">
                <p className="text-xs text-pink-400 text-center">
                  This is a sponsored advertisement. Click outside or X to close.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
