import { useState, useEffect, useRef } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.title)
  const inputRef = useRef(null)

  // Auto-focus the edit input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  function handleSave() {
    const trimmed = editValue.trim()
    if (!trimmed) return // reject empty
    onEdit(task.id, trimmed)
    setIsEditing(false)
  }

  function handleCancel() {
    setEditValue(task.title)
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  return (
    <div className="task-enter flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          task.completed
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-300 hover:border-indigo-400'
        }`}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && <Check size={11} color="white" strokeWidth={3} />}
      </button>

      {/* Title or Edit Input */}
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm text-slate-700 border-b-2 border-indigo-400 bg-transparent pb-0.5 focus:outline-none"
        />
      ) : (
        <span
          className={`flex-1 text-sm transition-all ${
            task.completed ? 'task-title-done' : 'text-slate-700'
          }`}
        >
          {task.title}
        </span>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
              aria-label="Save"
            >
              <Check size={15} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              aria-label="Cancel"
            >
              <X size={15} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => { setEditValue(task.title); setIsEditing(true) }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Edit task"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
