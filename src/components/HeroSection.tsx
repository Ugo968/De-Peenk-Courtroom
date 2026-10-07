import { motion } from 'framer-motion';
import type { Page } from '../App';

interface HeroSectionProps {
  setCurrentPage: (page: Page) => void;
}

export function HeroSection({ setCurrentPage }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gold-200/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 shadow-sm mb-8"
          >
            <span className="animate-pulse-soft">👑</span>
            <span className="text-sm font-medium text-pink-600">A Safe Space for Women's Justice</span>
            <span className="animate-pulse-soft">✨</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="text-gradient-pink">De Peenk</span>
            <br />
            <span className="text-gradient-gold">Courtroom</span>
          </motion.h1>

          {/* Motto */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-heading text-2xl md:text-3xl text-pink-500 italic mb-4"
          >
            "We Listen, We Judge."
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-pink-600/70 max-w-2xl mx-auto mb-12"
          >
            A gamified, highly secure dispute resolution platform for women.
            Your voice matters. Your identity stays protected. 💖
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center items-center"
          >
            <motion.button
              onClick={() => setCurrentPage('file-case')}
              className="px-8 py-4 rounded-3xl bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold text-lg shadow-pink hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              🎀 File a Case
            </motion.button>
            <motion.button
              onClick={() => setCurrentPage('lawyer-dashboard')}
              className="px-8 py-4 rounded-3xl bg-gradient-to-r from-sky-400 to-sky-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚖️ Lawyer Dashboard
            </motion.button>
            <motion.button
              onClick={() => setCurrentPage('cj-dashboard')}
              className="px-8 py-4 rounded-3xl bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold text-lg shadow-gold hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              👑 Chief Judge
            </motion.button>
            <motion.button
              onClick={() => setCurrentPage('cases')}
              className="px-8 py-4 rounded-3xl bg-white/80 backdrop-blur-sm border-2 border-pink-200 text-pink-600 font-semibold text-lg hover:bg-pink-50 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              💬 View Cases
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto"
          >
            {[
              { label: 'Cases Resolved', value: '2,847', emoji: '✨' },
              { label: 'Active Listeners', value: '1,203', emoji: '💖' },
              { label: 'Legal Advocates', value: '156', emoji: '⚖️' },
              { label: 'Chief Judges', value: '12', emoji: '👑' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="bg-white/60 backdrop-blur-sm rounded-3xl p-5 border border-pink-100 shadow-sm"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <div className="text-2xl mb-1">{stat.emoji}</div>
                <div className="font-heading text-2xl font-bold text-pink-700">{stat.value}</div>
                <div className="text-xs text-pink-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* How It Works - Courtroom Loop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-20 max-w-6xl mx-auto"
        >
          <h3 className="font-heading text-3xl font-bold text-center text-gradient-pink mb-8">
            ⚖️ How the Courtroom Works
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: '1', emoji: '🎀', title: 'File a Case', desc: 'Plaintiff submits her case (300 credits)', color: 'from-pink-100 to-pink-200' },
              { step: '2', emoji: '🔀', title: 'Smart Routing', desc: 'Relationships → CJ. Others → Lawyers', color: 'from-sky-100 to-sky-200' },
              { step: '3', emoji: '💬', title: 'Gallery Talk', desc: 'Listeners discuss in real-time (private)', color: 'from-pink-100 to-sky-100' },
              { step: '4', emoji: '👑', title: 'CJ Triage', desc: 'Chief Judge handles or delegates', color: 'from-gold-100 to-gold-200' },
              { step: '5', emoji: '⚖️', title: 'Resolution', desc: 'Final verdict delivered (+400 credits)', color: 'from-pink-100 to-pink-200' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className={`bg-gradient-to-br ${item.color} rounded-3xl p-5 border border-white/50 shadow-sm relative`}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ delay: 1.1 + i * 0.1 }}
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center font-bold text-pink-600 text-sm">
                  {item.step}
                </div>
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h4 className="font-heading text-base font-bold text-pink-800 mb-1">{item.title}</h4>
                <p className="text-pink-700/70 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="grid md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto"
        >
          {[
            {
              emoji: '🔒',
              title: 'Military-Grade Anonymity',
              description: 'Algorithmic handles ensure your real identity is never exposed. Encrypted PII, zero-knowledge architecture.',
              gradient: 'from-pink-100 to-pink-200',
            },
            {
              emoji: '🎮',
              title: 'Gamified Justice',
              description: 'Earn virtual lawyer credits, level up, build reputation. Every testimony counts toward your influence score.',
              gradient: 'from-sky-100 to-sky-200',
            },
            {
              emoji: '💰',
              title: 'Paystack Integration',
              description: 'Fund your wallet in Naira. Premium features, priority case filing, and legal consultation credits.',
              gradient: 'from-gold-100 to-gold-200',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              className={`bg-gradient-to-br ${feature.gradient} rounded-3xl p-8 border border-white/50 shadow-sm`}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ delay: 1.4 + i * 0.1 }}
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="font-heading text-xl font-bold text-pink-800 mb-2">{feature.title}</h3>
              <p className="text-pink-700/70 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
