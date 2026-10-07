import { useState } from 'react';
import { motion } from 'framer-motion';
import { BuyCreditsModal } from './BuyCreditsModal';
import type { WalletState } from '../hooks/useWallet';
import type { PackageType } from '../lib/economy';

interface WalletDashboardProps {
  wallet: WalletState;
  onCreditsAdded: (packageType: PackageType, credits: number) => void;
}

export function WalletDashboard({ wallet, onCreditsAdded }: WalletDashboardProps) {
  const [showModal, setShowModal] = useState(false);

  const progressToNextLevel = ((wallet.virtualLawyerCredits % 1000) / 1000) * 100;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-pink mb-4">
            💰 Wallet & Economy
          </h2>
          <p className="text-pink-600/70 text-lg">
            Manage your credits and track your courtroom journey
          </p>
        </motion.div>

        {/* Wallet Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Coins */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-6 border border-pink-300 shadow-pink"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">💰</span>
              <span className="px-3 py-1 rounded-full bg-white/60 text-xs font-medium text-pink-600">
                Coins
              </span>
            </div>
            <div className="font-heading text-4xl font-bold text-pink-800 mb-1">
              {wallet.balanceCredits.toLocaleString()}
            </div>
            <p className="text-sm text-pink-600/70">
              Used for filing cases, hiring lawyers, testifying & objects
            </p>
            <motion.button
              onClick={() => setShowModal(true)}
              className="mt-4 w-full px-4 py-3 rounded-2xl bg-white/80 text-pink-600 font-semibold text-sm hover:bg-white transition-colors border border-pink-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              💳 Buy More Coins
            </motion.button>
          </motion.div>

          {/* Virtual Lawyer Credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-sky-100 to-sky-200 rounded-3xl p-6 border border-sky-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">⚖️</span>
              <span className="px-3 py-1 rounded-full bg-white/60 text-xs font-medium text-sky-600">
                Virtual (Gamified)
              </span>
            </div>
            <div className="font-heading text-4xl font-bold text-sky-800 mb-1">
              {wallet.virtualLawyerCredits.toLocaleString()}
            </div>
            <p className="text-sm text-sky-600/70">
              Earned by winning cases (+400 per win)
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-sky-600 mb-1">
                <span>Level {wallet.level}</span>
                <span>Level {wallet.level + 1}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-sky-300/50">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Cases Won */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gold-100 to-gold-200 rounded-3xl p-6 border border-gold-300 shadow-gold"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🏆</span>
              <span className="px-3 py-1 rounded-full bg-white/60 text-xs font-medium text-gold-700">
                Reputation
              </span>
            </div>
            <div className="font-heading text-4xl font-bold text-gold-700 mb-1">
              {wallet.casesWon}
            </div>
            <p className="text-sm text-gold-700/70">
              Cases successfully resolved
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-lg">👑</span>
              <span className="text-sm font-medium text-gold-700">
                {wallet.role === 'CHIEF_JUDGE' ? 'Chief Judge' : wallet.role === 'LAWYER' ? 'Legal Advocate' : 'Floor Member'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Economy Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Real Money */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-sm">
            <h3 className="font-heading text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
              💰 Coin Packs (Paystack)
            </h3>
            <div className="space-y-3">
              {[
                { emoji: '💰', label: 'Coin Pack 1', price: '₦100', coins: '200' },
                { emoji: '💎', label: 'Coin Pack 2', price: '₦400', coins: '1,000' },
                { emoji: '👑', label: 'Coin Pack 3', price: '₦1,000', coins: '3,000' },
                { emoji: '👑', label: 'CJ Seat (2wks)', price: '₦3,500', coins: 'Access' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/50 border border-pink-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-sm font-medium text-pink-700">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-pink-600">{item.price}</span>
                    <span className="text-xs text-pink-400 ml-2">→ {item.coins}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Virtual Credits */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-sky-100 shadow-sm">
            <h3 className="font-heading text-xl font-bold text-sky-700 mb-4 flex items-center gap-2">
              ⚖️ Virtual Lawyer Credits (Gamified)
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                <h4 className="font-medium text-sky-700 mb-2">🎮 How to Earn</h4>
                <ul className="space-y-2 text-sm text-sky-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    Win a case: <span className="font-bold">+400 credits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    Resolve a case: <span className="font-bold">+400 credits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    Every 1,000 credits = <span className="font-bold">+1 Level</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-gold-50/50 border border-gold-200">
                <h4 className="font-medium text-gold-700 mb-2">⚠️ Important Note</h4>
                <p className="text-sm text-gold-700/70">
                  Virtual credits are <strong>NOT real money</strong>. They are purely for gamified reputation 
                  and leaderboard rankings. Lawyers do NOT get paid real money for winning cases.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
                <h4 className="font-medium text-pink-700 mb-2">🏆 Leaderboard Benefits</h4>
                <ul className="space-y-2 text-sm text-pink-600">
                  <li className="flex items-center gap-2">
                    <span>🥇</span> Top lawyers get featured badge
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🥈</span> Higher levels unlock premium features
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🥉</span> Reputation score affects case assignments
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Buy Credits Modal */}
      <BuyCreditsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userEmail="user@example.com"
        onSuccess={(packageType, credits) => {
          onCreditsAdded(packageType, credits);
        }}
      />
    </>
  );
}
