import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const TYPE_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success-subtle', border: 'border-success/20' },
  error: { icon: AlertCircle, color: 'text-danger', bg: 'bg-danger-subtle', border: 'border-danger/20' },
  info: { icon: Info, color: 'text-accent', bg: 'bg-accent-subtle', border: 'border-accent/20' },
};

export default function Toast({ message, type = 'success', onDone }) {
  const [visible, setVisible] = useState(true);
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.success;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence onExitComplete={onDone}>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border shadow-elevated ${config.bg} ${config.border}`}
          >
            <Icon size={16} className={config.color} />
            <span className="text-sm font-medium text-ink">{message}</span>
            <button
              onClick={() => setVisible(false)}
              className="p-0.5 rounded text-ink-tertiary hover:text-ink-secondary transition-colors ml-1"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
