import { Router } from 'express';

const router = Router();

let mockCalendar = [
  { id: 'e1', title: 'Mastering AI Agent Workflows', date: '2026-10-18', time: '10:00 AM', platform: 'YouTube', status: 'Scheduled' },
  { id: 'e2', title: '5 Design Principles Carousel', date: '2026-10-19', time: '02:00 PM', platform: 'Instagram', status: 'Scheduled' }
];

router.get('/calendar', (req, res) => {
  res.json({ success: true, data: mockCalendar });
});

router.post('/calendar', (req, res) => {
  const newEvent = { id: 'e_' + Date.now(), ...req.body };
  mockCalendar.push(newEvent);
  res.status(201).json({ success: true, data: newEvent });
});

router.post('/publish', (req, res) => {
  const { projectId, platform } = req.body;
  res.json({
    success: true,
    message: `Successfully dispatched publication job to ${platform || 'YouTube'} API`,
    jobId: 'pub_' + Date.now(),
    status: 'Published'
  });
});

export const publishingRouter = router;
