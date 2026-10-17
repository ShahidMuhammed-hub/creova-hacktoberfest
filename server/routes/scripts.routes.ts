import { Router } from 'express';
import { aiService } from '../services/ai.service.ts';

const router = Router();

let mockScript = {
  id: 's1',
  title: 'Mastering AI Agent Workflows in 2026',
  platform: 'YouTube',
  targetDuration: '8 minutes',
  language: 'English',
  content: {
    hook: 'What if you could delegate 80% of your content research to an AI agent?',
    introduction: 'Welcome back to the channel. Today we break down automated creator OS.',
    body: 'Point 1: Agentic research.\nPoint 2: Retention hooks.\nPoint 3: Localization.',
    callToAction: 'Drop a comment and subscribe.'
  },
  wordCount: 340,
  status: 'Ready'
};

router.get('/:id', (req, res) => {
  res.json({ success: true, data: mockScript });
});

router.patch('/:id', (req, res) => {
  mockScript = { ...mockScript, ...req.body };
  res.json({ success: true, data: mockScript });
});

router.post('/generate', async (req, res) => {
  try {
    const { hook, introduction } = req.body;
    const polished = await aiService.polishScript(hook || mockScript.content.hook, introduction || mockScript.content.introduction);
    res.json({ success: true, polished });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export const scriptsRouter = router;
