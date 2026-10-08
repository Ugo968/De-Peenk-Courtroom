import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CourtroomIntro } from './CourtroomIntro';

interface AppProps {
  children: React.ReactNode;
}

export default function App({ children }: AppProps) {
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

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <CourtroomIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>
      
      {introComplete && children}
    </>
  );
}
