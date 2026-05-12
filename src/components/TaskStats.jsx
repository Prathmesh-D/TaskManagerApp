import { activeCount } from '../utils/taskHelpers'

export default function TaskStats({ tasks, onClearCompleted }) {
  const remaining = activeCount(tasks)
  const hasCompleted = tasks.some(t => t.completed)

  return (
    <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
      <span>
        {remaining === 0
          ? tasks.length === 0 ? '' : 'All done! 🎉'
          : `${remaining} task${remaining !== 1 ? 's' : ''} remaining`}
      </span>
      {hasCompleted && (
        <button
          onClick={onClearCompleted}
          className="text-slate-400 hover:text-red-500 transition-colors underline underline-offset-2"
        >
          Clear completed
        </button>
      )}
    </div>
  )
}
