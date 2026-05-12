import TaskCard from './TaskCard';
import EmptyState from '../ui/EmptyState';

export default function TaskList({ tasks, allTasks, searchQuery, onToggle, onEdit, onDelete, onDuplicate }) {
  if (allTasks.length === 0) {
    return <EmptyState type="empty" />;
  }

  if (tasks.length === 0 && searchQuery) {
    return <EmptyState type="no-results" />;
  }

  if (tasks.length === 0) {
    const allCompleted = allTasks.length > 0 && allTasks.every(t => t.completed);
    return <EmptyState type={allCompleted ? 'all-done' : 'no-results'} />;
  }

  return (
    <div id="task-list" className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}
