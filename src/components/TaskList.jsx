import TaskItem from './TaskItem'

export default function TaskList({ tasks, filter, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    const messages = {
      all: { icon: '📋', text: 'No tasks yet. Add one above!' },
      active: { icon: '✅', text: 'No active tasks!' },
      completed: { icon: '🎯', text: 'No completed tasks yet.' },
    }
    const { icon, text } = messages[filter]
    return (
      <div className="text-center py-12 text-slate-400">
        <div className="text-4xl mb-3">{icon}</div>
        <p className="text-sm">{text}</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map(task => (
        <li key={task.id}>
          <TaskItem
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  )
}
