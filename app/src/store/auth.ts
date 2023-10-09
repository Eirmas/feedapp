import { defineStore } from 'pinia';
import { RouteLocation } from 'vue-router';

import { Session } from '@supabase/supabase-js';
import { supabase } from '@/plugins/supabase';

type State = {
  initialized: boolean;
  currentPromise: Promise<void> | null;
  currentSession: Session | null;
  redirectRoute: Partial<RouteLocation> | null;
};

type Getters = {
  isAuthenticated(): boolean;
};

type Actions = {
  loadSession(): Promise<void>;
  clearSession(): void;
  saveRedirectRoute(route: Partial<RouteLocation>): void;
  loadRedirectRoute(): void;
  clearRedirectRoute(): void;
};

export const useAuthStore = defineStore<'auth', State, Getters, Actions>('auth', {
  state: () => ({
    initialized: false,
    currentPromise: null,
    currentSession: null,
    redirectRoute: null,
  }),
  getters: {
    isAuthenticated() {
      return !!this.currentSession;
    },
  },
  actions: {
    loadSession() {
      this.currentPromise = supabase.auth.getSession().then(res => {
        this.currentSession = res.data.session;
        this.currentPromise = null;
        this.initialized = true;
      });
      return this.currentPromise;
    },
    clearSession() {
      this.currentSession = null;
    },
    saveRedirectRoute(route: Partial<RouteLocation>) {
      const { name, params, query, hash } = route;

      localStorage.setItem(
        'redirectRoute',
        JSON.stringify({
          name,
          params,
          query,
          hash,
        }),
      );
    },
    loadRedirectRoute() {
      const route = JSON.parse(localStorage.getItem('redirectRoute') || 'null') as Partial<RouteLocation> | null;

      this.redirectRoute = route;
    },
    clearRedirectRoute() {
      localStorage.removeItem('redirectRoute');
      this.redirectRoute = null;
    },
  },
});