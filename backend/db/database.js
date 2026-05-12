import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'tasks.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      completed  INTEGER NOT NULL DEFAULT 0,
      priority   TEXT NOT NULL DEFAULT 'medium',
      category   TEXT NOT NULL DEFAULT 'personal',
      due_date   TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Migrate existing tables that lack new columns
  const cols = db.prepare("PRAGMA table_info(tasks)").all().map(c => c.name);
  if (!cols.includes('priority')) {
    db.exec("ALTER TABLE tasks ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium'");
  }
  if (!cols.includes('category')) {
    db.exec("ALTER TABLE tasks ADD COLUMN category TEXT NOT NULL DEFAULT 'personal'");
  }
  if (!cols.includes('due_date')) {
    db.exec("ALTER TABLE tasks ADD COLUMN due_date TEXT");
  }

  console.log('Database initialized');
}

export default db;
