import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function TaskInput({ onAdd }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) {
      setError('Task title cannot be empty.')
      return
    }
    onAdd(value)
    setValue('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className={`flex gap-2 rounded-xl border-2 transition-colors ${
        error ? 'border-red-400' : 'border-slate-200 focus-within:border-indigo-400'
      } bg-white shadow-sm`}>
        <input
          type="text"
          value={value}
          onChange={e => { setValue(e.target.value); setError('') }}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-transparent"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 m-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 pl-1">{error}</p>
      )}
    </form>
  )
}
