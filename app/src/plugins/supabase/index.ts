import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

console.trace('hello')

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Supabase Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
