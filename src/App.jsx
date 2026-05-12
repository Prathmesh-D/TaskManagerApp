import { useState, useMemo } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { createTask, filterTasks } from './utils/taskHelpers'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import FilterBar from './components/FilterBar'
import TaskStats from './components/TaskStats'

export default function App() {
  const [tasks, setTasks] = useLocalStorage('tm_tasks', [])
  const [filter, setFilter] = useState('all')

  // --- Handlers ---
  function addTask(title) {
    setTasks(prev => [createTask(title), ...prev])
  }

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function editTask(id, newTitle) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t))
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTasks(prev => prev.filter(t => !t.completed))
  }

  // --- Derived State ---
  const visibleTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Task Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Stay focused, stay productive.</p>
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white p-6">
          <TaskInput onAdd={addTask} />
          <FilterBar filter={filter} onFilter={setFilter} />
          <TaskStats tasks={tasks} onClearCompleted={clearCompleted} />
          <TaskList
            tasks={visibleTasks}
            filter={filter}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        </div>

        <p className="text-center text-xs text-slate-300 mt-6">Tasks are saved in your browser automatically.</p>
      </div>
    </div>
  )
}
