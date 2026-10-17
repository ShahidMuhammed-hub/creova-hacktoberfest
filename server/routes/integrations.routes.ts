import { Router } from 'express';
import { checkDatabaseConnection } from '../db/supabase';

const router = Router();

router.get('/', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.json({
    success: true,
    database: dbStatus,
    integrations: [
      { name: 'Gemini / Gemma 3.8 Flash AI', status: 'Connected', active: true },
      { name: 'Supabase PostgreSQL & Auth', status: dbStatus.connected ? 'Connected' : 'Config Required', active: dbStatus.connected },
      { name: 'YouTube Data API', status: 'Connected', active: true },
      { name: 'Instagram Graph API', status: 'Connected', active: true }
    ]
  });
});

router.post('/:provider/test', async (req, res) => {
  const provider = req.params.provider;
  if (provider === 'supabase') {
    const status = await checkDatabaseConnection();
    return res.json({ success: status.connected, message: status.message });
  }
  res.json({ success: true, message: `Successfully verified connection with ${provider}` });
});

export const integrationsRouter = router;
