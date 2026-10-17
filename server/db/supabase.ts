import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function checkDatabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!supabase) {
    return {
      connected: false,
      message: 'Supabase URL or Key not provided. Operating in robust fallback memory mode. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env to connect to Supabase PostgreSQL.'
    };
  }

  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return { connected: true, message: 'Successfully connected to Supabase PostgreSQL database.' };
  } catch (err: any) {
    return { connected: false, message: `Supabase connection error: ${err.message}` };
  }
}
