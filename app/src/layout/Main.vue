<template>
  <nav class="bg-primary-lighter">
    <div class="flex gap-x-4 flex-wrap items-center justify-between mx-auto py-4 px-8">
      <RouterLink to="/" class="flex items-center">
        <img src="~@/assets/logo.svg" class="h-8" alt="Flowbite Logo" />
      </RouterLink>
      <div class="flex grow justify-end">
        <Menu v-if="user" as="div" class="relative inline-block text-left">
          <MenuButton class="flex gap-x-2 items-center hover:bg-primary-light/25 -mx-4 -my-2 py-2 px-4 rounded-xs">
            <Avatar size="small" :src="user.user_metadata.picture" :name="user.user_metadata.name"></Avatar>
            <div class="hidden sm:block text-body-small-bold">{{ user.user_metadata.name }}</div>
            <ChevronDownIcon class="w-4"></ChevronDownIcon>
          </MenuButton>
          <transition
            enterActiveClass="transition duration-100 ease-out"
            enterFromClass="transform scale-95 opacity-0"
            enterToClass="transform scale-100 opacity-100"
            leaveActiveClass="transition duration-75 ease-in"
            leaveFromClass="transform scale-100 opacity-100"
            leaveToClass="transform scale-95 opacity-0"
          >
            <MenuItems>
              <Card dense class="absolute -right-4 mt-3 w-56 origin-top-right bg-neutral-white">
                <List dense>
                  <ListSubheader>Settings</ListSubheader>
                  <MenuItem v-slot="{ active }"
                    ><ListItem :prependIcon="UserCircleIcon" :selected="active" href="/profile">Profile</ListItem></MenuItem
                  >
                  <MenuItem v-slot="{ active }"
                    ><ListItem :prependIcon="ArrowLeftOnRectangleIcon" :selected="active" href="/signout">Sign out</ListItem></MenuItem
                  >
                  <ListDivider></ListDivider>
                  <MenuItem v-slot="{ active }"
                    ><ListItem :prependIcon="CodeBracketIcon" :selected="active" href="https://github.com/eirmas/feedapp" targetBlank
                      >Github</ListItem
                    ></MenuItem
                  >
                </List>
              </Card>
            </MenuItems>
          </transition>
        </Menu>
        <Button v-else-if="route.name !== 'Index'" size="small" :icon="ArrowRightOnRectangleIcon" iconMode="prepend" @click="login"
          >Sign in</Button
        >
      </div>
    </div>
  </nav>
  <main class="app-main mx-8">
    <div class="container mx-auto xl:max-w-screen-xl xl:mx-auto">
      <slot></slot>
    </div>
  </main>
</template>

<script lang="ts" setup>
import Avatar from '@/components/atoms/avatar/Avatar.vue';
import Button from '@/components/atoms/button/Button.vue';
import Card from '@/components/atoms/card/Card.vue';
import List from '@/components/molecules/list/List.vue';
import ListDivider from '@/components/molecules/list/components/list-divider/ListDivider.vue';
import ListItem from '@/components/molecules/list/components/list-item/ListItem.vue';
import ListSubheader from '@/components/molecules/list/components/list-subheader/ListSubheader.vue';
import { login } from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  CodeBracketIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const { user } = storeToRefs(authStore);
</script>

<style lang="scss" scoped>
.app-main {
  @apply block flex-1 max-w-full transition-[padding] duration-100 ease-in-out bg-neutral-white;
}
</style>
