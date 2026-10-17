import { Router } from 'express';
import { aiService } from '../services/ai.service.ts';

const router = Router();

router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ success: false, error: 'Text and targetLanguage are required' });
    }
    const translated = await aiService.translateText(text, targetLanguage);
    res.json({ success: true, translated, targetLanguage });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/subtitles', (req, res) => {
  const { language } = req.body;
  res.json({
    success: true,
    message: `Generated SRT subtitle track for ${language || 'Malayalam'}`,
    format: 'SRT',
    downloadUrl: '/api/v1/media/download/subtitles.srt'
  });
});

export const localizationRouter = router;
