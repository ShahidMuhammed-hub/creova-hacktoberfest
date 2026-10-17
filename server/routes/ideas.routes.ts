import { Router } from 'express';
import { aiService } from '../services/ai.service.ts';

const router = Router();

let mockIdeas = [
  { id: 'i1', title: 'Why Most Creators Fail at Multilingual Scaling', hook: 'Stop translating your videos manually. Here is how top creators automate global reach.', platform: 'YouTube', angle: 'Educational' },
  { id: 'i2', title: 'The 3-Step Script Formula That Keeps Viewers Hooked', hook: 'If your retention drops at 30 seconds, you are making this mistake.', platform: 'Instagram', angle: 'Actionable Framework' }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: mockIdeas });
});

router.post('/generate', async (req, res) => {
  try {
    const { topic, platform } = req.body;
    if (!topic) return res.status(400).json({ success: false, error: 'Topic is required' });

    const text = await aiService.generateIdeas(topic, platform || 'YouTube');
    const newIdea = {
      id: 'i_' + Date.now(),
      title: `Idea for: ${topic}`,
      hook: text.slice(0, 100) + '...',
      platform: platform || 'YouTube',
      angle: 'AI Generated'
    };
    mockIdeas.unshift(newIdea);
    res.json({ success: true, data: newIdea, rawText: text });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export const ideasRouter = router;
