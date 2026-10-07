import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateAnonymousHandle, getRoleDisplayName, getRoleBadgeClasses } from '../lib/identity';
import type { UserRole } from '../lib/identity';

const roles: { value: UserRole; emoji: string; description: string }[] = [
  { value: 'LISTENER', emoji: '💖', description: 'Floor Member who listens and testifies' },
  { value: 'LAWYER', emoji: '⚖️', description: 'Legal Advocate providing counsel' },
  { value: 'CHIEF_JUDGE', emoji: '👑', description: 'Presiding Judge with final authority' },
  { value: 'PLAINTIFF', emoji: '🎀', description: 'Woman filing a case for resolution' },
];

export function IdentityGenerator() {
  const [role, setRole] = useState<UserRole>('LISTENER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [generatedHandle, setGeneratedHandle] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = () => {
    const handle = generateAnonymousHandle({
      role,
      firstName,
      lastName,
      phone,
    });
    setGeneratedHandle(handle);
    setShowResult(true);
  };

  const handleReset = () => {
    setShowResult(false);
    setGeneratedHandle('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-pink mb-4">
          🎭 Identity Generator
        </h2>
        <p className="text-pink-600/70 text-lg max-w-2xl mx-auto">
          Generate your anonymous courtroom handle. Your real identity stays encrypted and protected. 🔒
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-pink"
        >
          <h3 className="font-heading text-xl font-bold text-pink-700 mb-6">
            ✨ Enter Your Details
          </h3>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-pink-600 mb-3">Select Your Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => { setRole(r.value); setShowResult(false); }}
                  className={`p-3 rounded-2xl text-left transition-all ${
                    role === r.value
                      ? 'bg-gradient-to-r from-pink-100 to-pink-200 border-2 border-pink-400 shadow-sm'
                      : 'bg-pink-50/50 border border-pink-100 hover:border-pink-200'
                  }`}
                >
                  <span className="text-xl">{r.emoji}</span>
                  <div className="text-xs font-medium text-pink-700 mt-1">{r.value.replace('_', ' ')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Name Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pink-600 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setShowResult(false); }}
                placeholder="e.g., Adaeze"
                className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pink-600 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setShowResult(false); }}
                placeholder="e.g., Okonkwo"
                className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
            </div>
            {role === 'LISTENER' && (
              <div>
                <label className="block text-sm font-medium text-pink-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setShowResult(false); }}
                  placeholder="e.g., 08012345678"
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
                <p className="text-xs text-pink-400 mt-1">Required for Floor Listeners</p>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerate}
            className="w-full mt-6 px-6 py-4 rounded-3xl bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold text-lg shadow-pink hover:shadow-xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🎭 Generate My Handle
          </motion.button>
        </motion.div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          {showResult ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gold-200 shadow-gold text-center"
            >
              <div className="text-5xl mb-4 animate-float">🎉</div>
              <p className="text-sm text-pink-500 mb-2">Your Anonymous Handle</p>
              <div className="font-mono text-3xl font-bold text-gradient-gold mb-4">
                {generatedHandle}
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getRoleBadgeClasses(role)}`}>
                {getRoleDisplayName(role)}
              </div>
              <p className="text-xs text-pink-400 mt-4">
                🔒 This handle is your public identity. Your real name and contact details are encrypted.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 text-sm text-pink-500 hover:text-pink-700 underline"
              >
                Generate another
              </button>
            </motion.div>
          ) : (
            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 text-center">
              <div className="text-5xl mb-4 opacity-50">🔮</div>
              <p className="text-pink-400">Fill in your details and click generate to see your anonymous handle</p>
            </div>
          )}

          {/* Algorithm Explanation */}
          <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-pink-100">
            <h4 className="font-heading text-sm font-bold text-pink-700 mb-3">📐 Algorithm Rules</h4>
            <div className="space-y-2 text-xs text-pink-600">
              <p><span className="font-mono bg-pink-50 px-2 py-0.5 rounded">FL-</span> Last 2 of first name + First 2 of last name + Last 2 of phone</p>
              <p><span className="font-mono bg-sky-50 px-2 py-0.5 rounded">LW-</span> Shuffled initials + 4-char random hex</p>
              <p><span className="font-mono bg-gold-50 px-2 py-0.5 rounded">CJ-</span> W[current week] + 3-char random hex</p>
              <p><span className="font-mono bg-pink-50 px-2 py-0.5 rounded">PT-</span> Shuffled initials + 4-char random hex</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
