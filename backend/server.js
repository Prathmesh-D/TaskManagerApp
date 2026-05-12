import express from 'express';
import cors from 'cors';
import { initDB } from './db/database.js';
import tasksRouter from './routes/tasks.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRouter);

// Initialize database and start server
initDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
