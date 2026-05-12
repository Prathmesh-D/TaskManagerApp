const PRIORITY_CONFIG = {
  low: { label: 'Low', bg: 'bg-subtle', text: 'text-ink-secondary', dot: 'bg-ink-tertiary' },
  medium: { label: 'Med', bg: 'bg-warning-subtle', text: 'text-warning', dot: 'bg-warning' },
  high: { label: 'High', bg: 'bg-danger-subtle', text: 'text-danger', dot: 'bg-danger' },
};

export default function PriorityBadge({ priority, size = 'sm' }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const sizeClasses = size === 'xs' 
    ? 'text-2xs px-1.5 py-0.5 gap-1' 
    : 'text-xs px-2 py-0.5 gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
