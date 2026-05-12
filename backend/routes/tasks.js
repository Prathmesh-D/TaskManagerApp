import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

function formatTask(row) {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    priority: row.priority || 'medium',
    category: row.category || 'personal',
    due_date: row.due_date || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// GET /api/tasks
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    res.json(rows.map(formatTask));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks
router.post('/', (req, res) => {
  const { title, priority, category, due_date } = req.body;
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const stmt = db.prepare(
      'INSERT INTO tasks (title, priority, category, due_date) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(
      title.trim(),
      priority || 'medium',
      category || 'personal',
      due_date || null
    );
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(formatTask(task));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed, priority, category, due_date } = req.body;
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }

  try {
    const newTitle = title !== undefined ? title.trim() : existing.title;
    const newCompleted = completed !== undefined ? (completed ? 1 : 0) : existing.completed;
    const newPriority = priority !== undefined ? priority : existing.priority;
    const newCategory = category !== undefined ? category : existing.category;
    const newDueDate = due_date !== undefined ? due_date : existing.due_date;

    db.prepare(
      `UPDATE tasks SET title=?, completed=?, priority=?, category=?, due_date=?, updated_at=datetime('now') WHERE id=?`
    ).run(newTitle, newCompleted, newPriority, newCategory, newDueDate, id);

    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(formatTask(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
