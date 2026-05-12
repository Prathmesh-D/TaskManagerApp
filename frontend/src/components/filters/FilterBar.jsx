import { CATEGORIES } from '../../utils/helpers';
import CategoryPill from '../ui/CategoryPill';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
  { key: 'overdue', label: 'Overdue' },
];

const PRIORITY_TABS = [
  { key: 'all', label: 'Any' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

export default function FilterBar({
  statusFilter, onStatusFilter,
  priorityFilter, onPriorityFilter,
  categoryFilter, onCategoryFilter,
  completedCount, onClearCompleted,
}) {
  return (
    <div id="filter-bar" className="space-y-3 mb-6">
      {/* Status + Clear completed */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              id={`filter-status-${tab.key}`}
              onClick={() => onStatusFilter(tab.key)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-150 ${
                statusFilter === tab.key
                  ? 'bg-accent text-accent-fg shadow-sm'
                  : 'text-ink-secondary hover:text-ink hover:bg-subtle'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {completedCount > 0 && (
          <button
            id="clear-completed-btn"
            onClick={onClearCompleted}
            className="text-xs text-ink-tertiary hover:text-danger transition-colors"
          >
            Clear done ({completedCount})
          </button>
        )}
      </div>

      {/* Priority + Category row */}
      <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
        {/* Priority */}
        <div className="flex gap-1 shrink-0">
          {PRIORITY_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => onPriorityFilter(tab.key)}
              className={`text-2xs font-medium px-2 py-1 rounded-md transition-all duration-150 border ${
                priorityFilter === tab.key
                  ? 'bg-subtle text-ink border-line'
                  : 'border-transparent text-ink-tertiary hover:text-ink-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-line shrink-0" />

        {/* Categories */}
        <div className="flex gap-1.5 overflow-x-auto">
          <CategoryPill
            category="all"
            active={categoryFilter === 'all'}
            onClick={() => onCategoryFilter('all')}
          />
          {CATEGORIES.map(cat => (
            <CategoryPill
              key={cat.key}
              category={cat.key}
              active={categoryFilter === cat.key}
              onClick={() => onCategoryFilter(cat.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
