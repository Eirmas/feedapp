import { UserDomainModel } from 'domain-models';
import { defineStore } from 'pinia';

type State = {
  user: UserDomainModel | null;
};

export const useAuthStore = defineStore<'user', State>('user', {
  state: () => ({
    user: null,
  }),
});
