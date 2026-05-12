import { getCategoryColor, getCategoryLabel } from '../../utils/helpers';

export default function CategoryPill({ category, active, onClick }) {
  const color = getCategoryColor(category);
  const label = getCategoryLabel(category);

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-all duration-150
          ${active
            ? 'border-accent bg-accent-subtle text-accent'
            : 'border-line bg-transparent text-ink-secondary hover:border-line-hover hover:bg-subtle'
          }`}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-2xs font-medium text-ink-secondary px-1.5 py-0.5 rounded bg-subtle">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
