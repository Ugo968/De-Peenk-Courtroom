import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { CasesBoard } from './components/CasesBoard';
import { IdentityGenerator } from './components/IdentityGenerator';
import { PrismaSchema } from './components/PrismaSchema';
import { Dashboard } from './components/Dashboard';
import { WalletDashboard } from './components/WalletDashboard';
import { FileCaseForm } from './components/FileCaseForm';
import { LawyerDashboard } from './components/LawyerDashboard';
import { CJTriageDashboard } from './components/CJTriageDashboard';
import { CJPrivateChamber } from './components/CJPrivateChamber';
import { GalleryTalk } from './components/GalleryTalk';
import { CaseDetailView } from './components/CaseDetailView';
import { TopBanner } from './components/TopBanner';
import { SidebarAds } from './components/SidebarAds';
import { VideoAdPopup } from './components/VideoAdPopup';
import { BrandDashboard } from './components/BrandDashboard';
import { CJSlotSystem } from './components/CJSlotSystem';
import { LawyerSlotSystem } from './components/LawyerSlotSystem';
import { VideoAdRewards } from './components/VideoAdRewards';
import { CourtroomIntro } from './components/CourtroomIntro';
import { TrialCountdown } from './components/TrialCountdown';
import { Footer } from './components/Footer';
import { useWallet } from './hooks/useWallet';
import { mockCases } from './lib/mock-data';
import type { PackageType } from './lib/economy';
import type { CaseCategory } from './lib/mock-data';

export type Page = 'home' | 'cases' | 'identity' | 'schema' | 'dashboard' | 'wallet' | 'file-case' | 'lawyer-dashboard' | 'lawyer-slots' | 'video-rewards' | 'cj-dashboard' | 'cj-chamber' | 'case-detail' | 'brand-dashboard' | 'cj-slots';

export default function App() {
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Check if user has seen intro before
    const hasSeenIntro = localStorage.getItem('peeink_intro_complete');
    
    if (!hasSeenIntro) {
      setShowIntro(true);
    } else {
      setIntroComplete(true);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('peeink_intro_complete', 'true');
    setIntroComplete(true);
    setShowIntro(false);
  };
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedChamberCaseId, setSelectedChamberCaseId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('1'); // Default to first case for demo
  const [userGender, setUserGender] = useState<'MALE' | 'FEMALE'>('FEMALE'); // Default to FEMALE for demo
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(() => {
    // For demo: set trial to end in 3 days from now
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 3);
    return trialEnd.toISOString();
  });
  const { wallet, addCredits, spendCredits, rewardLawyerWin } = useWallet();

  const handleCreditsAdded = (_packageType: PackageType, credits: number) => {
    addCredits(credits);
  };

  const handleFileCase = (_data: { title: string; description: string; category: CaseCategory }) => {
    const success = spendCredits(200);
    if (!success) {
      alert('Failed to deduct coins');
    }
  };

  const handleResolveCase = (_caseId: string, _verdict: string) => {
    rewardLawyerWin();
  };

  const handleCJTriage = (caseId: string, action: 'HANDLE_MYSELF' | 'ASSIGN_TO_LAWYERS') => {
    console.log(`CJ ${action} for case ${caseId}`);
    // In production, this would call the API
  };

  const handleEnterChamber = (caseId: string) => {
    setSelectedChamberCaseId(caseId);
    setCurrentPage('cj-chamber');
  };

  const handleCJRuling = (caseId: string, _ruling: string) => {
    console.log(`CJ ruling for case ${caseId}`);
    rewardLawyerWin(); // CJ also gets virtual credits
  };

  const selectedChamberCase = selectedChamberCaseId 
    ? mockCases.find(c => c.id === selectedChamberCaseId) 
    : null;

  return (
    <div className="min-h-screen font-sans">
      {/* Courtroom Intro Experience */}
      <AnimatePresence>
        {showIntro && (
          <CourtroomIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Main App Content */}
      {introComplete && (
        <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* Wallet Quick View Bar */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-pink-100 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-pink-600">
              💰 <span className="font-bold">{wallet.balanceCredits.toLocaleString()}</span> coins
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

      {/* Top Banner Ad */}
      <TopBanner />

      {/* Trial Countdown - Floating Component */}
      {trialEndsAt && (
        <div className="fixed top-32 right-4 z-40 w-80">
          <TrialCountdown 
            trialEndsAt={trialEndsAt}
            onExpire={() => {
              setTrialEndsAt(null);
              // In production, this would call API to downgrade user
            }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex"
        >
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
          {currentPage === 'home' && <HeroSection setCurrentPage={setCurrentPage} />}
          {currentPage === 'cases' && (
            <CasesBoard 
              onViewCase={(caseId) => {
                setSelectedCaseId(caseId);
                setCurrentPage('case-detail');
              }} 
            />
          )}
          {currentPage === 'identity' && <IdentityGenerator />}
          {currentPage === 'schema' && <PrismaSchema />}
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'wallet' && (
            <WalletDashboard wallet={wallet} onCreditsAdded={handleCreditsAdded} userGender={userGender} />
          )}
          {currentPage === 'file-case' && (
            <FileCaseForm 
              onSubmit={handleFileCase} 
              currentCredits={wallet.balanceCredits}
              userGender={userGender}
            />
          )}
          {currentPage === 'lawyer-dashboard' && (
            <LawyerDashboard 
              virtualCredits={wallet.virtualLawyerCredits}
              casesWon={wallet.casesWon}
              level={wallet.level}
              onResolveCase={handleResolveCase}
            />
          )}
          {currentPage === 'lawyer-slots' && (
            <LawyerSlotSystem 
              userRole={wallet.role}
              userGender={userGender}
              userReligion="CHRISTIAN"
            />
          )}
          {currentPage === 'video-rewards' && (
            <VideoAdRewards 
              userRole={wallet.role}
              currentCredits={wallet.balanceCredits}
              onCreditsEarned={addCredits}
            />
          )}
          {currentPage === 'cj-dashboard' && (
            <CJTriageDashboard 
              cases={mockCases}
              onTriage={handleCJTriage}
              onEnterChamber={handleEnterChamber}
            />
          )}
          {currentPage === 'cj-chamber' && selectedChamberCase && (
            <CJPrivateChamber 
              caseData={selectedChamberCase}
              onSubmitRuling={handleCJRuling}
              onExit={() => setCurrentPage('cj-dashboard')}
            />
          )}
          {currentPage === 'case-detail' && (
            <CaseDetailView 
              caseId={selectedCaseId}
              userRole="LISTENER"
              userHandle="FL-DEMO89"
            />
          )}
          {currentPage === 'brand-dashboard' && (
            <BrandDashboard />
          )}
          {currentPage === 'cj-slots' && (
            <CJSlotSystem userGender={userGender} />
          )}
          </div>

          {/* Sidebar Ads */}
          <aside className="hidden lg:block w-80 flex-shrink-0 p-6">
            <div className="sticky top-32">
              <SidebarAds />
            </div>
          </aside>
        </motion.main>
      </AnimatePresence>

      {/* Video Ad Popup */}
      <VideoAdPopup />

      <Footer />
        </>
      )}
    </div>
  );
}
