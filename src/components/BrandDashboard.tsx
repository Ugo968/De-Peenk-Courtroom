import { useState } from 'react';
import { motion } from 'framer-motion';
import { AD_PACKAGES } from '../lib/ads';
import type { AdTier } from '../lib/ads';

const AD_DURATION_DAYS = 6;

export function BrandDashboard() {
  const [selectedTier, setSelectedTier] = useState<AdTier | null>(null);
  const [brandName, setBrandName] = useState('');
  const [brandEmail, setBrandEmail] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [adContent, setAdContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedPackage = AD_PACKAGES.find((p) => p.id === selectedTier);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTier || !brandName || !brandEmail || !adTitle || !adContent) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      // In production, this would call: POST /api/ads/initialize
      // For demo, we simulate the Paystack flow
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful payment
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowSuccess(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedTier(null);
        setBrandName('');
        setBrandEmail('');
        setAdTitle('');
        setAdContent('');
        setImageUrl('');
        setVideoUrl('');
        setLinkUrl('');
      }, 3000);
    } catch (error) {
      console.error('Ad purchase error:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getColorClasses = (color: 'pink' | 'sky' | 'gold' | 'purple') => {
    switch (color) {
      case 'pink':
        return {
          bg: 'bg-gradient-to-br from-pink-100 to-pink-200',
          border: 'border-pink-300',
          text: 'text-pink-700',
          selected: 'ring-pink-400 bg-gradient-to-br from-pink-200 to-pink-300',
        };
      case 'sky':
        return {
          bg: 'bg-gradient-to-br from-sky-100 to-sky-200',
          border: 'border-sky-300',
          text: 'text-sky-700',
          selected: 'ring-sky-400 bg-gradient-to-br from-sky-200 to-sky-300',
        };
      case 'gold':
        return {
          bg: 'bg-gradient-to-br from-gold-100 to-gold-200',
          border: 'border-gold-400',
          text: 'text-gold-700',
          selected: 'ring-gold-500 bg-gradient-to-br from-gold-200 to-gold-300',
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-100 to-purple-200',
          border: 'border-purple-300',
          text: 'text-purple-700',
          selected: 'ring-purple-400 bg-gradient-to-br from-purple-200 to-purple-300',
        };
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gold-200 shadow-gold text-center"
        >
          <div className="text-6xl mb-4 animate-float">🎉</div>
          <h2 className="font-heading text-3xl font-bold text-gradient-gold mb-4">
            Ad Purchase Successful!
          </h2>
          <p className="text-pink-600 mb-4">
            Your ad will be live within 24 hours and run for {AD_DURATION_DAYS} days
          </p>
          <div className="bg-gold-50 rounded-2xl p-4 border border-gold-200">
            <p className="text-sm text-gold-700 font-medium">
              Thank you for advertising with De Peenk Courtroom 👑
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
          📢 Brand Advertising
        </h2>
        <p className="text-pink-600/70 text-lg">
          Reach thousands of engaged women on De Peenk Courtroom
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-5 border border-pink-300 text-center">
          <div className="font-heading text-3xl font-bold text-pink-700">5,000+</div>
          <p className="text-sm text-pink-600">Active Users</p>
        </div>
        <div className="bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl p-5 border border-sky-300 text-center">
          <div className="font-heading text-3xl font-bold text-sky-700">95%</div>
          <p className="text-sm text-sky-600">Female Audience</p>
        </div>
        <div className="bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl p-5 border border-gold-300 text-center">
          <div className="font-heading text-3xl font-bold text-gold-700">High</div>
          <p className="text-sm text-gold-700">Engagement Rate</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        {/* Tier Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-pink mb-8"
        >
          <h3 className="font-heading text-xl font-bold text-pink-700 mb-6">
            Select Your Ad Tier
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AD_PACKAGES.map((pkg) => {
              const colors = getColorClasses(pkg.color);
              const isSelected = selectedTier === pkg.id;

              return (
                <motion.button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedTier(pkg.id)}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? `${colors.selected} ${colors.border} ring-2`
                      : `${colors.bg} ${colors.border} hover:shadow-lg`
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {pkg.badge && (
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        pkg.color === 'gold'
                          ? 'bg-gold-400 text-white'
                          : pkg.color === 'pink'
                          ? 'bg-pink-400 text-white'
                          : pkg.color === 'purple'
                          ? 'bg-purple-400 text-white'
                          : 'bg-sky-400 text-white'
                      }`}>
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{pkg.emoji}</span>
                    <div>
                      <h4 className={`font-heading font-bold ${colors.text}`}>
                        {pkg.label}
                      </h4>
                      <p className="text-xs text-pink-500 mt-0.5">{pkg.position}</p>
                    </div>
                  </div>

                  <p className="text-sm text-pink-600/70 mb-3">{pkg.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/50">
                    <div>
                      <div className="text-xs text-pink-500">Price</div>
                      <div className={`font-bold text-lg ${colors.text}`}>
                        ₦{pkg.amountNaira.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-pink-500">Duration</div>
                      <div className={`font-bold text-sm ${colors.text}`}>
                        {pkg.duration}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 left-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                    >
                      <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Ad Details Form */}
        {selectedTier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-pink mb-8"
          >
            <h3 className="font-heading text-xl font-bold text-pink-700 mb-6">
              Ad Details
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-pink-700 mb-2">
                    Brand Name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Your brand name"
                    className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pink-700 mb-2">
                    Brand Email <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={brandEmail}
                    onChange={(e) => setBrandEmail(e.target.value)}
                    placeholder="contact@yourbrand.com"
                    className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Ad Title <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="Catchy headline for your ad"
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Ad Content <span className="text-pink-400">*</span>
                </label>
                <textarea
                  value={adContent}
                  onChange={(e) => setAdContent(e.target.value)}
                  placeholder="Describe your product/service..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {selectedTier === 'VIDEO' && (
                <div>
                  <label className="block text-sm font-medium text-pink-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Landing Page URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://yourbrand.com/landing-page"
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Summary & Submit */}
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-gold-50 to-pink-50 rounded-3xl p-6 border border-gold-200 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-gold-700">
                Payment Summary
              </h3>
              <span className="text-sm text-pink-500">{AD_DURATION_DAYS} days duration</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-pink-600">Ad Tier:</span>
                <span className="font-medium text-pink-700">{selectedPackage.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pink-600">Position:</span>
                <span className="font-medium text-pink-700">{selectedPackage.position}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gold-200">
                <span className="text-pink-600 font-medium">Total:</span>
                <span className="font-bold text-xl text-gold-700">
                  ₦{selectedPackage.amountNaira.toLocaleString()}
                </span>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-6 px-6 py-4 rounded-3xl bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold text-lg shadow-gold hover:shadow-xl transition-all disabled:opacity-50"
              whileHover={!isProcessing ? { scale: 1.02 } : {}}
              whileTap={!isProcessing ? { scale: 0.98 } : {}}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Payment...
                </span>
              ) : (
                `💳 Pay ₦${selectedPackage.amountNaira.toLocaleString()} via Paystack`
              )}
            </motion.button>
          </motion.div>
        )}
      </form>
    </div>
  );
}
