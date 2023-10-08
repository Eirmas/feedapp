import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NX_SUPABASE_URL;
const supabaseKey = process.env.NX_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Supabase Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
