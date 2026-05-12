import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../../utils/helpers';

export default function TaskInput({ onAdd, preselectedDate }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (preselectedDate && preselectedDate.date) {
      setDueDate(preselectedDate.date);
      setExpanded(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [preselectedDate]);

  function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) { setError('Enter a task title'); return; }
    setError('');
    onAdd({ title: trimmed, priority, category, due_date: dueDate || null });
    setTitle('');
    // Optionally reset date after submit, or keep it. We'll reset it.
    setDueDate('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') { setTitle(''); setError(''); }
  }

  return (
    <div className="bg-panel border border-line rounded-xl p-4 mb-6 shadow-card">
      {/* Main input row */}
      <div className="flex gap-2.5">
        <input
          id="task-input"
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (error) setError(''); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setExpanded(true)}
          placeholder="What needs to be done?"
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-tertiary outline-none py-1"
          autoComplete="off"
        />
        <button
          id="add-task-btn"
          onClick={handleSubmit}
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-accent-fg text-xs font-medium px-3.5 py-2 rounded-lg transition-colors shrink-0"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Add task</span>
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-danger text-xs mt-2">{error}</p>}

      {/* Expanded options */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-3 border-t border-line">
              {/* Priority */}
              <div className="relative">
                <select
                  id="priority-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="appearance-none bg-subtle border border-line rounded-md pl-2.5 pr-7 py-1.5 text-xs text-ink-secondary cursor-pointer outline-none focus:border-accent transition-colors"
                  aria-label="Priority"
                >
                  {PRIORITIES.map(p => (
                    <option key={p.key} value={p.key}>{p.label} priority</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none" />
              </div>

              {/* Category */}
              <div className="relative">
                <select
                  id="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none bg-subtle border border-line rounded-md pl-2.5 pr-7 py-1.5 text-xs text-ink-secondary cursor-pointer outline-none focus:border-accent transition-colors"
                  aria-label="Category"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none" />
              </div>

              {/* Due date */}
              <input
                id="due-date-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-subtle border border-line rounded-md px-2.5 py-1.5 text-xs text-ink-secondary outline-none focus:border-accent transition-colors cursor-pointer"
                aria-label="Due date"
              />

              {/* Collapse */}
              <button
                onClick={() => setExpanded(false)}
                className="ml-auto text-2xs text-ink-tertiary hover:text-ink-secondary transition-colors"
              >
                Less
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
