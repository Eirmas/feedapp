import { defineStore } from 'pinia';
import { supabase } from '@/plugins/supabase';
import { UserDomainModel } from 'domain-models';

type State = {
  user: UserDomainModel | null;
};

type Getters = {
};

type Actions = {
  fetchUser(): Promise<void>;
};

export const useAuthStore = defineStore<'auth', State, Getters, Actions>('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    fetchUser() {
      this.currentPromise = supabase.auth.getSession().then(res => {
        this.currentSession = res.data.session;
        this.currentPromise = null;
        this.initialized = true;
      });
      return this.currentPromise;
    },
  },
});
