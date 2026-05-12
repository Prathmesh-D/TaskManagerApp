/**
 * Creates a new task object with a unique ID.
 * @param {string} title
 * @returns {{ id: string, title: string, completed: boolean, createdAt: number }}
 */
export function createTask(title) {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: Date.now(),
  }
}

/**
 * Returns filtered tasks based on the active filter tab.
 * @param {Array} tasks
 * @param {'all'|'active'|'completed'} filter
 * @returns {Array}
 */
export function filterTasks(tasks, filter) {
  if (filter === 'active') return tasks.filter(t => !t.completed)
  if (filter === 'completed') return tasks.filter(t => t.completed)
  return tasks
}

/**
 * Returns the count of tasks that are not yet completed.
 * @param {Array} tasks
 * @returns {number}
 */
export function activeCount(tasks) {
  return tasks.filter(t => !t.completed).length
}
