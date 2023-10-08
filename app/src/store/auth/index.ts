import { defineStore } from 'pinia';
import { RouteLocation } from 'vue-router';

import { User } from '@supabase/supabase-js';
import { supabase } from '@/plugins/supabase';

type State = {
  currentUser: User | null;
  redirectRoute: Partial<RouteLocation> | null;
};

type Getters = {
  isAuthenticated(): boolean;
};

type Actions = {
  loadUser(): void;
  clearUser(): void;
  saveRedirectRoute(route: Partial<RouteLocation>): void;
  loadRedirectRoute(): void;
  clearRedirectRoute(): void;
};

export const useAuthStore = defineStore<'auth', State, Getters, Actions>('auth', {
  state: () => ({
    currentUser: null,
    redirectRoute: null,
  }),
  getters: {
    isAuthenticated() {
      return !!this.currentUser;
    },
  },
  actions: {
    loadUser() {
      supabase.auth.getUser().then(res => {
        this.currentUser = res.data.user;
      });
    },
    clearUser() {
      this.currentUser = null;
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
