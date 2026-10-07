import { motion } from 'framer-motion';
import { mockUsers, mockCases, mockTestimonies } from '../lib/mock-data';
import { getRoleDisplayName, getRoleBadgeClasses } from '../lib/identity';

export function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-pink mb-4">
          📊 Platform Dashboard
        </h2>
        <p className="text-pink-600/70 text-lg">
          Live overview of De Peenk Courtroom activity
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {[
          { label: 'Total Users', value: '1,418', emoji: '👥', color: 'from-pink-100 to-pink-200' },
          { label: 'Active Cases', value: mockCases.length.toString(), emoji: '⚖️', color: 'from-sky-100 to-sky-200' },
          { label: 'Testimonies', value: mockTestimonies.length.toString(), emoji: '💬', color: 'from-gold-100 to-gold-200' },
          { label: 'Resolved', value: '2,847', emoji: '✨', color: 'from-pink-100 to-sky-100' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-3xl p-6 border border-white/50`}
          >
            <div className="text-3xl mb-2">{stat.emoji}</div>
            <div className="font-heading text-3xl font-bold text-pink-800">{stat.value}</div>
            <div className="text-sm text-pink-600/70 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-sm"
        >
          <h3 className="font-heading text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
            👥 Platform Users
          </h3>
          <div className="space-y-3">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/50 border border-pink-100 hover:bg-pink-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center text-lg">
                    {user.role === 'CHIEF_JUDGE' ? '👑' : user.role === 'LAWYER' ? '⚖️' : user.role === 'PLAINTIFF' ? '🎀' : '💖'}
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold text-pink-700">
                      {user.anonymousHandle}
                    </div>
                    <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClasses(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-pink-700">Lvl {user.level}</div>
                  <div className="text-xs text-pink-400">{user.reputationScore} rep</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-sm"
        >
          <h3 className="font-heading text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
            💬 Recent Testimonies
          </h3>
          <div className="space-y-3">
            {mockTestimonies.map((testimony) => (
              <div
                key={testimony.id}
                className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-pink-600 bg-pink-100 px-2 py-1 rounded-lg">
                    {testimony.authorHandle}
                  </span>
                  <span className="text-xs text-pink-400">❤️ {testimony.likes}</span>
                </div>
                <p className="text-sm text-pink-700/80 line-clamp-2">{testimony.content}</p>
                <div className="mt-2 text-xs text-pink-400">{testimony.createdAt}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Case Status Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-sm"
      >
        <h3 className="font-heading text-xl font-bold text-pink-700 mb-6 flex items-center gap-2">
          🔄 Case Pipeline
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { status: 'OPEN', count: mockCases.filter(c => c.status === 'OPEN').length, emoji: '🟢' },
            { status: 'CJ_REVIEW', count: mockCases.filter(c => c.status === 'CJ_REVIEW').length, emoji: '🟡' },
            { status: 'CJ_ASSIGNED', count: mockCases.filter(c => c.status === 'CJ_ASSIGNED').length, emoji: '🔵' },
            { status: 'CJ_HANDLING', count: mockCases.filter(c => c.status === 'CJ_HANDLING').length, emoji: '🟣' },
            { status: 'DELIBERATING', count: mockCases.filter(c => c.status === 'DELIBERATING').length, emoji: '🟠' },
            { status: 'RESOLVED', count: mockCases.filter(c => c.status === 'RESOLVED').length, emoji: '🩷' },
          ].map((item) => (
            <div key={item.status} className="text-center p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="font-heading text-2xl font-bold text-pink-700">{item.count}</div>
              <div className="text-xs text-pink-500 font-medium">{item.status.replace('_', ' ')}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
