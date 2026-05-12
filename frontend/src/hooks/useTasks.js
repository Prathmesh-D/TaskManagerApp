import { useState, useEffect, useMemo, useCallback } from 'react';
import * as api from '../api/tasks';

export function useTasks({ statusFilter, priorityFilter, categoryFilter, searchQuery }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const data = await api.getTasks();
        if (!cancelled) { setTasks(data); setError(null); }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, []);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (statusFilter === 'active') result = result.filter(t => !t.completed);
    else if (statusFilter === 'completed') result = result.filter(t => t.completed);
    else if (statusFilter === 'overdue') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(t => !t.completed && t.due_date && t.due_date < today);
    }
    if (priorityFilter && priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t => t.title.toLowerCase().includes(q));
    }
    return result;
  }, [tasks, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const today = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(t => !t.completed && t.due_date && t.due_date < today).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, active, overdue, rate };
  }, [tasks]);

  const addTask = useCallback(async ({ title, priority, category, due_date }) => {
    const optimistic = {
      id: Date.now(), title: title.trim(), completed: false,
      priority: priority || 'medium', category: category || 'personal',
      due_date: due_date || null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      _optimistic: true,
    };
    setTasks(prev => [optimistic, ...prev]);
    try {
      const created = await api.createTask({ title: title.trim(), priority, category, due_date });
      setTasks(prev => prev.map(t => t === optimistic ? created : t));
      return true;
    } catch (err) {
      setTasks(prev => prev.filter(t => t !== optimistic));
      setError(err.message);
      return false;
    }
  }, []);

  const toggleTask = useCallback(async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try {
      const updated = await api.updateTask(id, { completed: !task.completed });
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: task.completed } : t));
      setError(err.message);
    }
  }, [tasks]);

  const editTask = useCallback(async (id, changes) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t));
    try {
      const updated = await api.updateTask(id, changes);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      return true;
    } catch (err) {
      setTasks(prev => prev.map(t => t.id === id ? task : t));
      setError(err.message);
      return false;
    }
  }, [tasks]);

  const removeTask = useCallback(async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await api.deleteTask(id);
    } catch (err) {
      setTasks(prev => {
        const idx = tasks.findIndex(t => t.id === id);
        const copy = [...prev];
        copy.splice(idx, 0, task);
        return copy;
      });
      setError(err.message);
    }
  }, [tasks]);

  const duplicateTask = useCallback(async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    await addTask({
      title: task.title,
      priority: task.priority,
      category: task.category,
      due_date: task.due_date,
    });
  }, [tasks, addTask]);

  const clearCompleted = useCallback(async () => {
    const completed = tasks.filter(t => t.completed);
    if (completed.length === 0) return 0;
    setTasks(prev => prev.filter(t => !t.completed));
    try {
      await Promise.all(completed.map(t => api.deleteTask(t.id)));
      return completed.length;
    } catch (err) {
      const data = await api.getTasks();
      setTasks(data);
      return 0;
    }
  }, [tasks]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading, error, stats,
    addTask, toggleTask, editTask, removeTask, duplicateTask, clearCompleted,
  };
}
