import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { CasesBoard } from './components/CasesBoard';
import { IdentityGenerator } from './components/IdentityGenerator';
import { PrismaSchema } from './components/PrismaSchema';
import { Dashboard } from './components/Dashboard';
import { Footer } from './components/Footer';

export type Page = 'home' | 'cases' | 'identity' | 'schema' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <div className="min-h-screen font-sans">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
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
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
