import { supabase } from '@/plugins/supabase';

export const login = () => {
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.href,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
};

export const logout = () => {
  supabase.auth.signOut();
};
