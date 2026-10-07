import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Page } from '../App';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const navItems: { label: string; page: Page; emoji: string }[] = [
  { label: 'Home', page: 'home', emoji: '🏠' },
  { label: 'Cases', page: 'cases', emoji: '⚖️' },
  { label: 'File Case', page: 'file-case', emoji: '🎀' },
  { label: 'Lawyer', page: 'lawyer-dashboard', emoji: '⚖️' },
  { label: 'Chief Judge', page: 'cj-dashboard', emoji: '👑' },
  { label: 'Brands', page: 'brand-dashboard', emoji: '📢' },
  { label: 'Identity', page: 'identity', emoji: '🎭' },
  { label: 'Wallet', page: 'wallet', emoji: '💰' },
  { label: 'Schema', page: 'schema', emoji: '🗄️' },
  { label: 'Dashboard', page: 'dashboard', emoji: '📊' },
];

export function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-pink-100 shadow-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentPage('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">⚖️</span>
            <div>
              <h1 className="font-heading text-lg font-bold text-gradient-pink leading-tight">
                De Peenk Courtroom
              </h1>
              <p className="text-[9px] text-pink-400 font-medium tracking-wide uppercase whitespace-nowrap">
                We Listen. We Judge. We Advise. We Compensate.
              </p>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 shadow-sm'
                    : 'text-pink-600 hover:bg-pink-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1">{item.emoji}</span>
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl bg-pink-50 text-pink-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page);
                    setMobileOpen(false);
                  }}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium text-left transition-all ${
                    currentPage === item.page
                      ? 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700'
                      : 'text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  <span className="mr-2">{item.emoji}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
