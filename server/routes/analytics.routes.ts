import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    metrics: [
      { label: 'Total Views', value: '248,590', change: '+18.4%' },
      { label: 'Engagement Rate', value: '8.7%', change: '+2.1%' },
      { label: 'Subscriber Growth', value: '+14,250', change: '+12.8%' }
    ]
  });
});

export const analyticsRouter = router;
