import { supabase } from '@/plugins/supabase';

export const login = () => {
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.host,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
};
