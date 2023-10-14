import { ApiUpdateUserDto, ApiUserEntity } from '@/services/api/data-contracts';
import { defineStore } from 'pinia';
import userService from '@/services/user';

type State = {
  user: ApiUserEntity | null;
};

type Actions = {
  loadUser(): Promise<void>;
  clearUser(): void;
  updateUser(data: ApiUpdateUserDto): Promise<void>;
};

type Getters = Record<string, never>;

export const useUserStore = defineStore<'user', State, Getters, Actions>('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    async loadUser() {
      try {
        userService.getUser().then(res => {
          this.user = res.data;
        });
      } catch (error) {
        console.log(error);
      }
    },
    clearUser() {
      this.user = null;
    },
    async updateUser(data: ApiUpdateUserDto) {
      try {
        await userService.updateUser(data);

        if (this.user) {
          this.user = {
            ...this.user,
            ...data,
          };
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
