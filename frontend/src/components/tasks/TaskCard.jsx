import { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Check, X, Copy, Calendar, ChevronDown } from 'lucide-react';
import PriorityBadge from '../ui/PriorityBadge';
import CategoryPill from '../ui/CategoryPill';
import { getDueDateLabel, isOverdue, isDueToday, CATEGORIES, PRIORITIES } from '../../utils/helpers';

export default function TaskCard({ task, onToggle, onEdit, onDelete, onDuplicate }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');
  const [editCategory, setEditCategory] = useState(task.category || 'personal');
  const editRef = useRef(null);

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editing]);

  function startEdit() {
    setEditValue(task.title);
    setEditPriority(task.priority || 'medium');
    setEditCategory(task.category || 'personal');
    setEditing(true);
  }

  function resetEdit() {
    setEditValue(task.title);
    setEditPriority(task.priority || 'medium');
    setEditCategory(task.category || 'personal');
    setEditing(false);
  }

  function handleSave() {
    const trimmed = editValue.trim();
    if (!trimmed) { resetEdit(); return; }
    onEdit(task.id, { title: trimmed, priority: editPriority, category: editCategory });
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') resetEdit();
  }

  const dueDateLabel = getDueDateLabel(task.due_date);
  const overdue = !task.completed && isOverdue(task.due_date);
  const dueToday = !task.completed && isDueToday(task.due_date);

  return (
    <div
      className={`group bg-panel border rounded-xl p-3.5 shadow-card transition-[box-shadow,border-color] duration-150 hover:shadow-elevated animate-fade-in ${
        overdue ? 'border-danger/30' : 'border-line hover:border-line-hover'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          id={`task-check-${task.id}`}
          className={`task-checkbox mt-0.5 ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 3.5L3.5 6L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <input
                ref={editRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-sm text-ink outline-none border-b border-accent pb-0.5"
                aria-label="Edit task title"
              />
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="appearance-none bg-subtle border border-line rounded-md pl-2 pr-6 py-1 text-2xs font-medium text-ink-secondary cursor-pointer outline-none focus:border-accent"
                    aria-label="Edit priority"
                  >
                    {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                  </select>
                  <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="appearance-none bg-subtle border border-line rounded-md pl-2 pr-6 py-1 text-2xs font-medium text-ink-secondary cursor-pointer outline-none focus:border-accent"
                    aria-label="Edit category"
                  >
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                  <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className={`text-sm leading-relaxed break-words ${
                task.completed ? 'line-through text-ink-tertiary' : 'text-ink'
              }`}>
                {task.title}
              </p>
              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <PriorityBadge priority={task.priority} size="xs" />
                <CategoryPill category={task.category} />
                {dueDateLabel && (
                  <span className={`inline-flex items-center gap-1 text-2xs font-medium px-1.5 py-0.5 rounded ${
                    overdue ? 'bg-danger-subtle text-danger' :
                    dueToday ? 'bg-warning-subtle text-warning' :
                    'bg-subtle text-ink-tertiary'
                  }`}>
                    <Calendar size={10} />
                    {dueDateLabel}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
          {editing ? (
            <>
              <button onClick={handleSave} className="p-1.5 rounded-md text-success hover:bg-success-subtle transition-colors" aria-label="Save">
                <Check size={14} />
              </button>
              <button onClick={resetEdit} className="p-1.5 rounded-md text-ink-tertiary hover:bg-subtle transition-colors" aria-label="Cancel">
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <button id={`task-edit-${task.id}`} onClick={startEdit} className="p-1.5 rounded-md text-ink-tertiary hover:text-ink hover:bg-subtle transition-colors" aria-label="Edit task">
                <Pencil size={14} />
              </button>
              <button onClick={() => onDuplicate(task.id)} className="p-1.5 rounded-md text-ink-tertiary hover:text-ink hover:bg-subtle transition-colors" aria-label="Duplicate task">
                <Copy size={14} />
              </button>
              <button id={`task-delete-${task.id}`} onClick={() => onDelete(task.id)} className="p-1.5 rounded-md text-ink-tertiary hover:text-danger hover:bg-danger-subtle transition-colors" aria-label="Delete task">
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
