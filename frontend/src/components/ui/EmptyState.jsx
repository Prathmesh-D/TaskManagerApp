import { motion } from 'framer-motion';

const STATES = {
  empty: {
    title: 'No tasks yet',
    subtitle: 'Create your first task to get started',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-ink-tertiary">
        <rect x="8" y="10" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M20 24H28M24 20V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  'no-results': {
    title: 'No matching tasks',
    subtitle: 'Try adjusting your search or filters',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-ink-tertiary">
        <circle cx="22" cy="22" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M30 30L38 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 22H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  'all-done': {
    title: 'All tasks completed',
    subtitle: 'Great work! Time for a break.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-success">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 24L22 30L32 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

export default function EmptyState({ type = 'empty' }) {
  const state = STATES[type] || STATES.empty;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 gap-3"
    >
      <div className="mb-1">{state.icon}</div>
      <p className="text-sm font-medium text-ink-secondary">{state.title}</p>
      <p className="text-xs text-ink-tertiary">{state.subtitle}</p>
    </motion.div>
  );
}
