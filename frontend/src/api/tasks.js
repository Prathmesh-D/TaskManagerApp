const BASE_URL = 'http://localhost:3001';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function getTasks() {
  return request(`${BASE_URL}/api/tasks`);
}

export function createTask({ title, priority, category, due_date }) {
  return request(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, priority, category, due_date }),
  });
}

export function updateTask(id, changes) {
  return request(`${BASE_URL}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
}

export function deleteTask(id) {
  return request(`${BASE_URL}/api/tasks/${id}`, { method: 'DELETE' });
}
