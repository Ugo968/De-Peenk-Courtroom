import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CourtroomIntroProps {
  onComplete: () => void;
}

export function CourtroomIntro({ onComplete }: CourtroomIntroProps) {
  const [currentScene, setCurrentScene] = useState<1 | 2 | 3>(1);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const gavelAudioRef = useRef<HTMLAudioElement | null>(null);
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null);
  const chimeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    gavelAudioRef.current = new Audio('/audio/gavel-hit.mp3');
    welcomeAudioRef.current = new Audio('/audio/welcome-voice.mp3');
    chimeAudioRef.current = new Audio('/audio/melodious-chime.mp3');

    // Scene 1: Play gavel hit after 1 second
    const scene1Timer = setTimeout(() => {
      playAudio(gavelAudioRef.current);
      // Move to scene 2 after gavel animation (3 seconds)
      setTimeout(() => {
        setCurrentScene(2);
      }, 3000);
    }, 1000);

    return () => clearTimeout(scene1Timer);
  }, []);

  const playAudio = (audio: HTMLAudioElement | null) => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback: Web Speech API for welcome voice
        if (audio === welcomeAudioRef.current) {
          speakWelcome();
        }
      });
    }
  };

  const speakWelcome = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        'Ladies and Gentlemen, welcome to the Peenk Courtroom'
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Try to find a female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => 
        v.name.includes('Female') || 
        v.name.includes('Woman') ||
        v.name.includes('Samantha') ||
        v.name.includes('Victoria')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSignupComplete = () => {
    // Play chime and welcome voice
    playAudio(chimeAudioRef.current);
    
    setTimeout(() => {
      playAudio(welcomeAudioRef.current);
      setAudioPlayed(true);
      
      // After voice plays (3 seconds), play second gavel hit
      setTimeout(() => {
        playAudio(gavelAudioRef.current);
        
        // Move to scene 3 after gavel
        setTimeout(() => {
          setCurrentScene(3);
        }, 2000);
      }, 3000);
    }, 500);
  };

  const handleSeatSelected = () => {
    // Complete intro
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {currentScene === 1 && (
          <Scene1 key="scene1" />
        )}
        
        {currentScene === 2 && (
          <Scene2 
            key="scene2" 
            onComplete={handleSignupComplete}
          />
        )}
        
        {currentScene === 3 && (
          <Scene3 
            key="scene3"
            onSeatSelected={handleSeatSelected}
            audioPlayed={audioPlayed}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Scene 1: Gavel Hit Animation
function Scene1() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5 }}
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #FFD1DC 0%, #87CEEB 50%, #FFD1DC 100%)',
      }}
    >
      {/* Gavel Animation */}
      <motion.div
        initial={{ y: -500, rotate: -45 }}
        animate={{ 
          y: [null, 0, 0],
          rotate: [null, 0, 10],
        }}
        transition={{ 
          duration: 0.8,
          times: [0, 0.7, 1],
          ease: 'easeOut',
        }}
        className="relative"
      >
        <div className="text-[200px] select-none">⚖️</div>
        
        {/* Impact Effect */}
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-32 h-32 rounded-full bg-white/50 blur-xl" />
        </motion.div>
      </motion.div>

      {/* Crack Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M 50 0 L 50 100"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* BANG Text */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.5, 1],
          opacity: [0, 1, 0],
        }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="text-9xl font-bold text-white drop-shadow-2xl">
          BANG!
        </div>
      </motion.div>
    </motion.div>
  );
}

// Scene 2: Signup Form
function Scene2({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
    religion: '',
  });
  const [showMaleNotice, setShowMaleNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.password || !formData.gender || !formData.religion) {
      alert('Please fill in all fields');
      return;
    }
    
    // Store user data (in production, this would call an API)
    localStorage.setItem('peeink_user', JSON.stringify(formData));
    
    onComplete();
  };

  const handleGenderChange = (gender: string) => {
    setFormData({ ...formData, gender });
    setShowMaleNotice(gender === 'MALE');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute inset-0 flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #FFD1DC 0%, #E0F6FF 50%, #FFD1DC 100%)',
      }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-pink-200"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-2"
          >
            ⚖️
          </motion.div>
          <h1 className="font-heading text-3xl font-bold text-gradient-pink mb-2">
            Welcome to De Peenk Courtroom
          </h1>
          <p className="text-pink-600 text-sm">
            "We Listen. We Judge. We Advise. We Compensate."
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-pink-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-sm"
                placeholder="Adaeze"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-pink-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-sm"
                placeholder="Okonkwo"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-pink-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-sm"
              placeholder="adaeze@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-pink-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-sm"
              placeholder="08012345678"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-pink-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-pink-700 mb-1">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleGenderChange('FEMALE')}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  formData.gender === 'FEMALE'
                    ? 'bg-pink-100 border-pink-400 text-pink-700'
                    : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-50'
                }`}
              >
                👩 Female
              </button>
              <button
                type="button"
                onClick={() => handleGenderChange('MALE')}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  formData.gender === 'MALE'
                    ? 'bg-sky-100 border-sky-400 text-sky-700'
                    : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-50'
                }`}
              >
                👨 Male
              </button>
            </div>
            
            {/* Male Notice */}
            <AnimatePresence>
              {showMaleNotice && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-3 bg-sky-50 border border-sky-200 rounded-xl"
                >
                  <p className="text-xs text-sky-700">
                    💙 Gentlemen, you are welcome as Listeners only. Special pricing applies.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Religion */}
          <div>
            <label className="block text-xs font-medium text-pink-700 mb-1">
              Religion
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, religion: 'MUSLIM' })}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  formData.religion === 'MUSLIM'
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                    : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-50'
                }`}
              >
                ☪️ Muslim
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, religion: 'CHRISTIAN' })}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  formData.religion === 'CHRISTIAN'
                    ? 'bg-sky-100 border-sky-400 text-sky-700'
                    : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-50'
                }`}
              >
                ✝️ Christian
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            ✨ Enter the Courtroom
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Scene 3: Courtroom Floor with Seat Selection
function Scene3({ onSeatSelected, audioPlayed }: { onSeatSelected: () => void, audioPlayed: boolean }) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Generate seats (5 rows, 8 seats per row)
  const seats = Array.from({ length: 40 }, (_, i) => i);

  const handleSeatClick = (seatIndex: number) => {
    setSelectedSeat(seatIndex);
    
    // After selecting seat, wait 1.5 seconds then complete
    setTimeout(() => {
      onSeatSelected();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(180deg, #FFD1DC 0%, #E0F6FF 50%, #FFD1DC 100%)',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="font-heading text-4xl font-bold text-gradient-pink mb-2">
          The Courtroom Floor
        </h1>
        <p className="text-pink-600">
          {audioPlayed ? 'Choose your seat' : 'Welcome! Please choose your seat'}
        </p>
      </motion.div>

      {/* Judge's Bench */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-gold-200 to-gold-300 rounded-3xl px-12 py-4 shadow-xl border-4 border-gold-400">
          <div className="text-center">
            <div className="text-5xl mb-1">👑</div>
            <div className="font-heading text-lg font-bold text-gold-700">
              Chief Judge's Bench
            </div>
          </div>
        </div>
      </motion.div>

      {/* Seats Grid */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-8 gap-3 max-w-2xl"
      >
        {seats.map((seatIndex) => {
          const row = Math.floor(seatIndex / 8);
          const isOccupied = Math.random() > 0.7; // 30% occupied for demo
          
          return (
            <motion.button
              key={seatIndex}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + seatIndex * 0.02 }}
              onClick={() => !isOccupied && handleSeatClick(seatIndex)}
              disabled={isOccupied || selectedSeat !== null}
              className={`relative w-12 h-12 rounded-2xl transition-all ${
                isOccupied
                  ? 'bg-gray-200 cursor-not-allowed opacity-50'
                  : selectedSeat === seatIndex
                  ? 'bg-gradient-to-br from-pink-400 to-pink-600 shadow-xl scale-110'
                  : 'bg-gradient-to-br from-pink-200 to-pink-300 hover:from-pink-300 hover:to-pink-400 hover:scale-105 cursor-pointer shadow-md'
              }`}
              whileHover={!isOccupied && selectedSeat === null ? { scale: 1.1 } : {}}
              whileTap={!isOccupied && selectedSeat === null ? { scale: 0.95 } : {}}
            >
              {/* Seat Cushion */}
              <div className="absolute inset-1 rounded-xl bg-white/30 backdrop-blur-sm" />
              
              {/* Seat Number */}
              <div className="relative text-xs font-bold text-pink-700">
                {seatIndex + 1}
              </div>

              {/* Occupied Indicator */}
              {isOccupied && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg">💺</span>
                </div>
              )}

              {/* Selected Indicator */}
              {selectedSeat === seatIndex && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-2xl">✨</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-pink-600">
          {selectedSeat !== null 
            ? '✨ Taking your seat...' 
            : '💺 Tap an empty pink cushion to sit'}
        </p>
      </motion.div>
    </motion.div>
  );
}
