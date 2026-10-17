import { Router } from 'express';

const router = Router();

let mockTasks = [
  { id: 't1', title: 'Finalize B-roll footage for YouTube tutorial', priority: 'High', dueDate: 'Today, 5:00 PM', completed: false },
  { id: 't2', title: 'Review translated Arabic & Malayalam subtitles', priority: 'Medium', dueDate: 'Tomorrow', completed: false }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: mockTasks });
});

router.post('/', (req, res) => {
  const newTask = { id: 't_' + Date.now(), completed: false, ...req.body };
  mockTasks.push(newTask);
  res.status(201).json({ success: true, data: newTask });
});

router.patch('/:id', (req, res) => {
  mockTasks = mockTasks.map(t => t.id === req.params.id ? { ...t, ...req.body } : t);
  res.json({ success: true, message: 'Task updated' });
});

export const tasksRouter = router;
