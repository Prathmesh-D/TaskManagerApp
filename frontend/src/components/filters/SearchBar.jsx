import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div id="search-bar" className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks…"
        className="w-full bg-subtle border border-line rounded-lg pl-9 pr-9 py-2.5 text-sm text-ink placeholder:text-ink-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
        aria-label="Search tasks"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink-secondary transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
