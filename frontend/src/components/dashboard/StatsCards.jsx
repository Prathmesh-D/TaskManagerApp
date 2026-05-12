import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import ProgressRing from '../ui/ProgressRing';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

export default function StatsCards({ stats }) {
  const cards = [
    { label: 'Total', value: stats.total, icon: TrendingUp, color: 'text-accent' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-success' },
    { label: 'Pending', value: stats.active, icon: Clock, color: 'text-warning' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-danger' },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 mb-6"
    >
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            variants={item}
            className="bg-panel border border-line rounded-xl p-3.5 flex items-center gap-3 shadow-card"
          >
            <div className={`${card.color}`}>
              <Icon size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="text-lg font-semibold text-ink font-mono leading-none">{card.value}</p>
              <p className="text-2xs text-ink-tertiary mt-0.5">{card.label}</p>
            </div>
          </motion.div>
        );
      })}

      {/* Completion rate */}
      {stats.total > 0 && (
        <motion.div
          variants={item}
          className="col-span-2 bg-panel border border-line rounded-xl p-3.5 flex items-center gap-4 shadow-card"
        >
          <ProgressRing value={stats.rate} size={36} stroke={3} />
          <div className="flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-semibold text-ink font-mono">{stats.rate}%</span>
              <span className="text-xs text-ink-tertiary">completion rate</span>
            </div>
            <div className="mt-1.5 h-1.5 bg-subtle rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.rate}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
