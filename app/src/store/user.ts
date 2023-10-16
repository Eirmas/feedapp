import { ApiUpdateUserDto, ApiUserEntity } from '@/services/api/data-contracts';
import { defineStore } from 'pinia';
import userService from '@/services/user';
import { useNotifications } from '@/composables/useNotifications';
import { AxiosError } from 'axios';

type State = {
  user: ApiUserEntity | null;
};

type Actions = {
  loadUser(): Promise<void>;
  clearUser(): void;
  updateUser(data: ApiUpdateUserDto): Promise<void>;
};

type Getters = Record<string, never>;

const notifications = useNotifications();

export const useUserStore = defineStore<'user', State, Getters, Actions>('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    async loadUser() {
      try {
        this.user = (await userService.getUser()).data;
      } catch (err) {
        notifications.error({ title: "Couldn't load user" }, err);
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
      } catch (err) {
        notifications.error({ title: "Couldn't update user" }, err as AxiosError);
      }
    },
  },
});
