const FILTERS = ['all', 'active', 'completed']

export default function FilterBar({ filter, onFilter }) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-4">
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => onFilter(f)}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
            filter === f
              ? 'bg-white text-indigo-700 shadow-sm font-semibold'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
