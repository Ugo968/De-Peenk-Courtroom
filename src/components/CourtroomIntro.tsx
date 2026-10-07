import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CourtroomSignup } from './CourtroomSignup';
import { CourtroomFloor } from './CourtroomFloor';

interface CourtroomIntroProps {
  onComplete: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: 'MALE' | 'FEMALE';
    religion: 'MUSLIM' | 'CHRISTIAN';
  }) => void;
}

export function CourtroomIntro({ onComplete }: CourtroomIntroProps) {
  const [scene, setScene] = useState<'gavel' | 'signup' | 'floor'>('gavel');
  const [showCrack, setShowCrack] = useState(false);

  useEffect(() => {
    // Scene 1: Gavel animation (3 seconds)
    const gavelTimer = setTimeout(() => {
      setShowCrack(true);
      setTimeout(() => {
        setScene('signup');
      }, 800);
    }, 3000);

    return () => clearTimeout(gavelTimer);
  }, []);

  const handleSignupComplete = (userData: any) => {
    // Play welcome audio (simulated)
    try {
      // In production, play actual audio files
      // const audio = new Audio('/audio/welcome-voice.mp3');
      // audio.play();
    } catch (error) {
      console.log('Audio playback not available');
    }

    // Second gavel hit animation (simulated with timeout)
    setTimeout(() => {
      setScene('floor');
    }, 3000);
  };

  const handleSeatSelected = (seatId: number) => {
    // Redirect to main dashboard
    onComplete({
      firstName: 'User',
      lastName: 'Name',
      email: 'user@example.com',
      phone: '08012345678',
      gender: 'FEMALE',
      religion: 'CHRISTIAN',
    });
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence mode="wait">
        {/* SCENE 1: Gavel Animation */}
        {scene === 'gavel' && (
          <motion.div
            key="gavel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-pink-800 to-sky-900" />

            {/* Ambient particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-pink-300/30 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  animate={{
                    y: [null, -100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* 3D Gavel */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [-180, 0],
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <div className="relative">
                {/* Gavel handle */}
                <motion.div
                  className="w-4 h-48 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full shadow-2xl"
                  animate={{
                    rotate: [0, -45, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 1.5,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Gavel head */}
                <motion.div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg shadow-2xl"
                  animate={{
                    y: [0, 100, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 1.5,
                    ease: 'easeIn',
                  }}
                >
                  {/* Gold band */}
                  <div className="absolute inset-x-0 top-1/2 h-2 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Impact effect */}
            {showCrack && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Crack lines */}
                <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <motion.path
                    d="M 50 50 L 30 20 L 10 0"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.path
                    d="M 50 50 L 70 20 L 90 0"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                  <motion.path
                    d="M 50 50 L 50 100"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </svg>

                {/* Flash effect */}
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ duration: 0.5 }}
                />

                {/* BANG text */}
                <motion.div
                  className="relative z-10 font-heading text-8xl font-bold text-white drop-shadow-2xl"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: [0, 1.5, 1], rotate: [-10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  BANG!
                </motion.div>
              </motion.div>
            )}

            {/* Courtroom text */}
            <motion.div
              className="absolute bottom-20 left-0 right-0 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="font-heading text-5xl font-bold text-white drop-shadow-2xl">
                De Peenk Courtroom
              </h1>
              <p className="text-xl text-pink-200 mt-2 italic">
                "We Listen. We Judge. We Advise. We Compensate."
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* SCENE 2: Signup Form */}
        {scene === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gradient-to-br from-pink-100 via-white to-sky-100 overflow-y-auto"
          >
            <CourtroomSignup onComplete={handleSignupComplete} />
          </motion.div>
        )}

        {/* SCENE 3: Courtroom Floor */}
        {scene === 'floor' && (
          <motion.div
            key="floor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-pink-50 to-sky-50 overflow-y-auto"
          >
            <CourtroomFloor onSeatSelected={handleSeatSelected} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
