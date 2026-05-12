export function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(date);
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
}

export function pluralize(n, singular, plural) {
  return n === 1 ? singular : (plural || singular + 's');
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;
  return dateStr < new Date().toISOString().split('T')[0];
}

export function isDueToday(dateStr) {
  if (!dateStr) return false;
  return dateStr === new Date().toISOString().split('T')[0];
}

export function isDueTomorrow(dateStr) {
  if (!dateStr) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return dateStr === tomorrow.toISOString().split('T')[0];
}

export function getDueDateLabel(dateStr) {
  if (!dateStr) return null;
  if (isOverdue(dateStr)) return 'Overdue';
  if (isDueToday(dateStr)) return 'Today';
  if (isDueTomorrow(dateStr)) return 'Tomorrow';
  return formatShortDate(dateStr);
}

export const CATEGORIES = [
  { key: 'personal', label: 'Personal', color: '#6366F1' },
  { key: 'work', label: 'Work', color: '#2D9F6F' },
  { key: 'study', label: 'Study', color: '#E09B13' },
  { key: 'health', label: 'Health', color: '#DC4A3F' },
];

export const PRIORITIES = [
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
];

export function getCategoryColor(key) {
  return CATEGORIES.find(c => c.key === key)?.color || '#6B6B6B';
}

export function getCategoryLabel(key) {
  return CATEGORIES.find(c => c.key === key)?.label || key;
}
