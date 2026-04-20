import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  importCSV
} from './tasksController.js';

const router = express.Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.patch('/tasks/:id/complete', completeTask);
router.get('/import', importCSV);

export default router;