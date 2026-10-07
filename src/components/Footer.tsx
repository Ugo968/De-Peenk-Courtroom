import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-pink-100 bg-white/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚖️</span>
              <h3 className="font-heading text-xl font-bold text-gradient-pink">De Peenk Courtroom</h3>
            </div>
            <p className="text-pink-600/60 text-sm max-w-md">
              A gamified, highly secure dispute resolution platform for women. 
              Your voice matters. Your identity stays protected. Built with love 💖
            </p>
            <p className="font-heading text-lg italic text-pink-400 mt-3">
              "We Listen, We Judge."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-pink-700 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-pink-600/70">
              <li className="hover:text-pink-600 cursor-pointer transition-colors">⚖️ Browse Cases</li>
              <li className="hover:text-pink-600 cursor-pointer transition-colors">🎭 Identity System</li>
              <li className="hover:text-pink-600 cursor-pointer transition-colors">📊 Dashboard</li>
              <li className="hover:text-pink-600 cursor-pointer transition-colors">💰 Wallet & Credits</li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-bold text-pink-700 mb-3">Case Categories</h4>
            <ul className="space-y-2 text-sm text-pink-600/70">
              <li>💕 Relationships</li>
              <li>💍 Marriage</li>
              <li>👨‍👩‍👧‍👦 Family</li>
              <li>🛡️ Girl Safety</li>
              <li>📚 Education & Career</li>
              <li>🤱 Motherhood</li>
            </ul>
          </div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 pt-8 border-t border-pink-100"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-pink-400">
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-100">Next.js 14</span>
            <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-100">Prisma + PostgreSQL</span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-100">NextAuth</span>
            <span className="px-3 py-1 rounded-full bg-gold-50 border border-gold-200">Paystack (NGN)</span>
            <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-100">Supabase Realtime</span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-100">Tailwind CSS</span>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-xs text-pink-400">
            © 2024 De Peenk Courtroom. All rights reserved. Made with 💖 for women everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
