import { Router } from 'express';

const router = Router();

router.post('/search', (req, res) => {
  const { query } = req.body;
  res.json({
    success: true,
    sources: [
      { id: 1, title: `Market Analysis on ${query || 'Creator Tools'}`, publisher: 'TechCrunch', url: 'https://example.com/1', date: 'Oct 2026' },
      { id: 2, title: 'State of Autonomous AI Agents in Media', publisher: 'Wired', url: 'https://example.com/2', date: 'Oct 2026' }
    ]
  });
});

export const researchRouter = router;
