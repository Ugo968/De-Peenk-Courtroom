import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { CasesBoard } from './components/CasesBoard';
import { IdentityGenerator } from './components/IdentityGenerator';
import { PrismaSchema } from './components/PrismaSchema';
import { Dashboard } from './components/Dashboard';
import { WalletDashboard } from './components/WalletDashboard';
import { Footer } from './components/Footer';
import { useWallet } from './hooks/useWallet';
import type { PackageType } from './lib/economy';

export type Page = 'home' | 'cases' | 'identity' | 'schema' | 'dashboard' | 'wallet';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { wallet, addCredits } = useWallet();

  const handleCreditsAdded = (_packageType: PackageType, credits: number) => {
    addCredits(credits);
  };

  return (
    <div className="min-h-screen font-sans">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* Wallet Quick View Bar */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-pink-100 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-pink-600">
              💎 <span className="font-bold">{wallet.balanceCredits.toLocaleString()}</span> credits
            </span>
            <span className="flex items-center gap-1 text-sky-600">
              ⚖️ <span className="font-bold">{wallet.virtualLawyerCredits.toLocaleString()}</span> virtual
            </span>
            <span className="flex items-center gap-1 text-gold-700">
              🏆 <span className="font-bold">{wallet.casesWon}</span> wins
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 font-medium">
              Lvl {wallet.level}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-600 font-medium">
              {wallet.role === 'LAWYER' ? '⚖️ Lawyer' : wallet.role === 'CHIEF_JUDGE' ? '👑 CJ' : '💖 Listener'}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentPage === 'home' && <HeroSection setCurrentPage={setCurrentPage} />}
          {currentPage === 'cases' && <CasesBoard />}
          {currentPage === 'identity' && <IdentityGenerator />}
          {currentPage === 'schema' && <PrismaSchema />}
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'wallet' && (
            <WalletDashboard wallet={wallet} onCreditsAdded={handleCreditsAdded} />
          )}
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
