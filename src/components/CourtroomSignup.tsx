import { useState } from 'react';
import { motion } from 'framer-motion';

interface CourtroomSignupProps {
  onComplete: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: 'MALE' | 'FEMALE';
    religion: 'MUSLIM' | 'CHRISTIAN';
    password: string;
  }) => void;
}

export function CourtroomSignup({ onComplete }: CourtroomSignupProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    gender: '' as 'MALE' | 'FEMALE' | '',
    religion: '' as 'MUSLIM' | 'CHRISTIAN' | '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.religion) {
      newErrors.religion = 'Please select your religion';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Play welcome audio (simulated)
      // In production: const audio = new Audio('/audio/welcome-voice.mp3');
      // audio.play();

      // Wait for audio (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));

      onComplete({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender as 'MALE' | 'FEMALE',
        religion: formData.religion as 'MUSLIM' | 'CHRISTIAN',
        password: formData.password,
      });
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'Failed to create account. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-6xl mb-4"
          >
            ⚖️
          </motion.div>
          <h1 className="font-heading text-4xl font-bold text-gradient-pink mb-2">
            Welcome to De Peenk Courtroom
          </h1>
          <p className="text-pink-600/70 text-lg italic">
            "We Listen. We Judge. We Advise. We Compensate."
          </p>
        </div>

        {/* Signup Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-pink space-y-6"
        >
          {/* Personal Information */}
          <div>
            <h3 className="font-heading text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
              <span>👤</span> Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  First Name <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="e.g., Adaeze"
                  className={`w-full px-4 py-3 rounded-2xl border ${
                    errors.firstName ? 'border-red-300' : 'border-pink-200'
                  } bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300`}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Last Name <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="e.g., Okonkwo"
                  className={`w-full px-4 py-3 rounded-2xl border ${
                    errors.lastName ? 'border-red-300' : 'border-pink-200'
                  } bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-heading text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
              <span>📧</span> Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Email <span className="text-pink-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 rounded-2xl border ${
                    errors.email ? 'border-red-300' : 'border-pink-200'
                  } bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Phone Number <span className="text-pink-400">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+234 801 234 5678"
                  className={`w-full px-4 py-3 rounded-2xl border ${
                    errors.phone ? 'border-red-300' : 'border-pink-200'
                  } bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Gender & Religion */}
          <div>
            <h3 className="font-heading text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
              <span>🌟</span> Identity
            </h3>
            <div className="space-y-4">
              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-3">
                  Gender <span className="text-pink-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    onClick={() => handleChange('gender', 'FEMALE')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      formData.gender === 'FEMALE'
                        ? 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-400 shadow-sm'
                        : 'bg-pink-50/50 border-pink-100 hover:border-pink-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-1">👩</div>
                    <div className="text-sm font-medium text-pink-700">Female</div>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => handleChange('gender', 'MALE')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      formData.gender === 'MALE'
                        ? 'bg-gradient-to-br from-sky-100 to-sky-200 border-sky-400 shadow-sm'
                        : 'bg-sky-50/50 border-sky-100 hover:border-sky-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-1">👨</div>
                    <div className="text-sm font-medium text-sky-700">Male</div>
                  </motion.button>
                </div>
                {errors.gender && (
                  <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
                )}
                {formData.gender === 'MALE' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 bg-sky-50 border border-sky-200 rounded-2xl p-3"
                  >
                    <p className="text-sm text-sky-700">
                      💙 Gentlemen, you are welcome as Listeners only. Special pricing applies.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Religion Selection */}
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-3">
                  Religion <span className="text-pink-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    onClick={() => handleChange('religion', 'MUSLIM')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      formData.religion === 'MUSLIM'
                        ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-400 shadow-sm'
                        : 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-1">☪️</div>
                    <div className="text-sm font-medium text-emerald-700">Muslim</div>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => handleChange('religion', 'CHRISTIAN')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      formData.religion === 'CHRISTIAN'
                        ? 'bg-gradient-to-br from-sky-100 to-sky-200 border-sky-400 shadow-sm'
                        : 'bg-sky-50/50 border-sky-100 hover:border-sky-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-1">✝️</div>
                    <div className="text-sm font-medium text-sky-700">Christian</div>
                  </motion.button>
                </div>
                {errors.religion && (
                  <p className="text-xs text-red-500 mt-1">{errors.religion}</p>
                )}
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <h3 className="font-heading text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
              <span>🔒</span> Security
            </h3>
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Password <span className="text-pink-400">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Minimum 8 characters"
                className={`w-full px-4 py-3 rounded-2xl border ${
                  errors.password ? 'border-red-300' : 'border-pink-200'
                } bg-pink-50/30 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 rounded-3xl bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold text-lg shadow-pink hover:shadow-xl transition-all disabled:opacity-50"
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Your Account...
              </span>
            ) : (
              '⚖️ Enter the Courtroom'
            )}
          </motion.button>

          {/* Privacy Notice */}
          <p className="text-center text-xs text-pink-400">
            🔒 Your identity is encrypted and protected. Only your anonymous handle will be visible.
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}
