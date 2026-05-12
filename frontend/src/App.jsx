import { useState, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { useDebounce } from './hooks/useDebounce';
import { useTasks } from './hooks/useTasks';
import Header from './components/layout/Header';
import StatsCards from './components/dashboard/StatsCards';
import TaskInput from './components/tasks/TaskInput';
import FilterBar from './components/filters/FilterBar';
import TaskList from './components/tasks/TaskList';
import Toast from './components/ui/Toast';
import ConfirmModal from './components/ui/ConfirmModal';

import MiniCalendar from './components/dashboard/MiniCalendar';

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchRaw, setSearchRaw] = useState('');
  const searchQuery = useDebounce(searchRaw, 200);

  // Toast
  const [toast, setToast] = useState(null);

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState({ open: false });

  // Date selection
  const [selectedDateForNewTask, setSelectedDateForNewTask] = useState(null);

  const handleDateSelect = useCallback((dateStr) => {
    setSelectedDateForNewTask({ date: dateStr, ts: Date.now() });
  }, []);

  const {
    tasks, allTasks, loading, error, stats,
    addTask, toggleTask, editTask, removeTask, duplicateTask, clearCompleted,
  } = useTasks({ statusFilter, priorityFilter, categoryFilter, searchQuery });

  const handleAdd = useCallback(async (taskData) => {
    const ok = await addTask(taskData);
    if (ok) setToast({ message: 'Task added', type: 'success' });
  }, [addTask]);

  const handleEdit = useCallback(async (id, changes) => {
    const ok = await editTask(id, changes);
    if (ok) setToast({ message: 'Task saved', type: 'success' });
  }, [editTask]);

  const handleDelete = useCallback(async (id) => {
    await removeTask(id);
  }, [removeTask]);

  const handleDuplicate = useCallback(async (id) => {
    await duplicateTask(id);
    setToast({ message: 'Task duplicated', type: 'info' });
  }, [duplicateTask]);

  const handleClearCompleted = useCallback(() => {
    setConfirmModal({
      open: true,
      title: 'Clear completed tasks',
      message: `Remove ${stats.completed} completed task${stats.completed === 1 ? '' : 's'}? This cannot be undone.`,
      confirmLabel: 'Clear all',
      onConfirm: async () => {
        setConfirmModal({ open: false });
        const count = await clearCompleted();
        if (count > 0) setToast({ message: `Cleared ${count} task${count === 1 ? '' : 's'}`, type: 'success' });
      },
    });
  }, [clearCompleted, stats.completed]);

  return (
    <div className="min-h-screen bg-canvas transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-20">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          searchValue={searchRaw}
          onSearch={setSearchRaw}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mt-8">
          {/* Main Tasks Area */}
          <div className="lg:col-span-3">
            <TaskInput onAdd={handleAdd} preselectedDate={selectedDateForNewTask} />
            <FilterBar
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilter={setPriorityFilter}
              categoryFilter={categoryFilter}
              onCategoryFilter={setCategoryFilter}
              completedCount={stats.completed}
              onClearCompleted={handleClearCompleted}
            />

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-6 h-6 border-2 border-line border-t-accent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-sm text-danger mb-2">Connection error</p>
                <p className="text-xs text-ink-tertiary">{error}</p>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                allTasks={allTasks}
                searchQuery={searchQuery}
                onToggle={toggleTask}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            )}
          </div>

          {/* Productivity Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <StatsCards stats={stats} />
            <MiniCalendar tasks={allTasks} onDateSelect={handleDateSelect} />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          key={Date.now()}
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ open: false })}
      />
    </div>
  );
}
