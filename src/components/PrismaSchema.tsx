import { useState } from 'react';
import { motion } from 'framer-motion';
import { PRISMA_SCHEMA } from '../lib/prisma-schema';

export function PrismaSchema() {
  const [activeTab, setActiveTab] = useState<'schema' | 'commands'>('schema');

  const terminalCommands = `# 1. Create Next.js project
npx create-next-app@latest de-peeink-courtroom \\
  --typescript --tailwind --eslint --app --src-dir

# 2. Navigate to project
cd de-peeink-courtroom

# 3. Install Prisma
npm install prisma --save-dev
npm install @prisma/client

# 4. Initialize Prisma
npx prisma init --datasource-provider postgresql

# 5. Install Auth & Payment dependencies
npm install next-auth @auth/prisma-adapter
npm install bcryptjs crypto-js

# 6. Install Paystack
npm install paystack-api

# 7. Install Supabase Realtime
npm install @supabase/supabase-js

# 8. Install UI dependencies
npm install framer-motion lucide-react
npm install @headlessui/react

# 9. Set environment variables in .env
# DATABASE_URL="postgresql://user:password@host:5432/dbname"
# NEXTAUTH_SECRET="your-secret-here"
# NEXTAUTH_URL="http://localhost:3000"
# PAYSTACK_SECRET_KEY="sk_test_xxx"
# PAYSTACK_PUBLIC_KEY="pk_test_xxx"
# SUPABASE_URL="https://xxx.supabase.co"
# SUPABASE_ANON_KEY="xxx"
# ENCRYPTION_KEY="your-32-char-encryption-key"

# 10. Generate Prisma Client
npx prisma generate

# 11. Push schema to database
npx prisma db push`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-pink mb-4">
          🗄️ Database Schema
        </h2>
        <p className="text-pink-600/70 text-lg max-w-2xl mx-auto">
          Complete Prisma schema with all models, enums, and relations. Ready for PostgreSQL on Supabase.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6 justify-center"
      >
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-6 py-3 rounded-2xl font-medium transition-all ${
            activeTab === 'schema'
              ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-pink'
              : 'bg-white/60 text-pink-600 border border-pink-200'
          }`}
        >
          📋 Prisma Schema
        </button>
        <button
          onClick={() => setActiveTab('commands')}
          className={`px-6 py-3 rounded-2xl font-medium transition-all ${
            activeTab === 'commands'
              ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-pink'
              : 'bg-white/60 text-pink-600 border border-pink-200'
          }`}
        >
          💻 Terminal Commands
        </button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 rounded-3xl p-6 overflow-hidden shadow-xl border border-pink-200/20"
      >
        {activeTab === 'schema' ? (
          <div className="relative">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-gray-400 text-sm font-mono">prisma/schema.prisma</span>
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto max-h-[600px] overflow-y-auto font-mono leading-relaxed">
              <code>{PRISMA_SCHEMA}</code>
            </pre>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-gray-400 text-sm font-mono">terminal</span>
            </div>
            <pre className="text-sm text-green-300 overflow-x-auto max-h-[600px] overflow-y-auto font-mono leading-relaxed">
              <code>{terminalCommands}</code>
            </pre>
          </div>
        )}
      </motion.div>

      {/* Model Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8"
      >
        {[
          { name: 'User', emoji: '👤', fields: 18 },
          { name: 'Wallet', emoji: '💰', fields: 8 },
          { name: 'Case', emoji: '⚖️', fields: 14 },
          { name: 'Testimony', emoji: '💬', fields: 6 },
          { name: 'GalleryComment', emoji: '🖼️', fields: 6 },
          { name: 'Ad', emoji: '📢', fields: 10 },
        ].map((model) => (
          <div
            key={model.name}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-pink-100 text-center"
          >
            <div className="text-2xl mb-1">{model.emoji}</div>
            <div className="font-mono text-sm font-bold text-pink-700">{model.name}</div>
            <div className="text-xs text-pink-400">{model.fields} fields</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
