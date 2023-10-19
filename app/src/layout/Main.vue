<template>
  <nav class="bg-primary-lighter relative z-10">
    <div class="flex gap-x-4 flex-wrap items-center justify-between mx-auto py-4 px-4 md:px-8">
      <RouterLink to="/" class="flex items-center cursor-pointer -mx-4 -my-2 py-2 px-4 rounded-xs focus-outline">
        <img src="~@/assets/logo.svg" class="h-8" alt="FeedApp Logo" />
      </RouterLink>
      <div class="flex grow justify-end items-center">
        <div class="mr-6 rounded-xs overflow-hidden cursor-pointer hover:ring-2 ring-semantic-focus transition-all" @click="toggle">
          <img v-if="currentLocale === 'en'" src="~@/assets/en.svg" class="h-6 md:h-8" alt="English" />
          <img v-if="currentLocale === 'no'" src="~@/assets/no.svg" class="h-6 md:h-8" alt="Norsk" />
        </div>
        <Menu v-if="user" as="div" class="relative inline-block text-left">
          <MenuButton class="flex gap-x-2 items-center hover:bg-primary-light/25 -mx-4 -my-2 py-2 px-4 rounded-xs focus-outline">
            <Avatar size="small" :src="user.avatar" :name="user.name"></Avatar>
            <div class="hidden sm:block text-body-small-bold">{{ user.name }}</div>
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
                  <MenuItem v-slot="{ active }">
                    <RouterLink :to="{ name: 'Profile' }">
                      <ListItem :prependIcon="UserCircleIcon" :selected="active" value="profile">{{ $t('profile.profile') }}</ListItem>
                    </RouterLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <RouterLink :to="{ name: 'Sign out' }">
                      <ListItem :prependIcon="ArrowLeftOnRectangleIcon" :selected="active" value="signout">{{
                        $t('common.signOut')
                      }}</ListItem>
                    </RouterLink>
                  </MenuItem>
                  <ListDivider></ListDivider>
                  <MenuItem v-slot="{ active }">
                    <ListItem :prependIcon="CodeBracketIcon" :selected="active" href="https://github.com/eirmas/feedapp" targetBlank>{{
                      $t('common.github')
                    }}</ListItem>
                  </MenuItem>
                </List>
              </Card>
            </MenuItems>
          </transition>
        </Menu>
        <Button v-else-if="route.name !== 'Index'" size="small" :icon="ArrowRightOnRectangleIcon" iconMode="prepend" @click="login">{{
          $t('common.signIn')
        }}</Button>
      </div>
    </div>
  </nav>
  <main class="block flex-1 max-w-full transition-[padding] duration-100 ease-in-out bg-neutral-white mx-4 md:mx-8">
    <div class="container mx-auto xl:max-w-screen-xl xl:mx-auto my-12">
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
import { useUserStore } from '@/store/user';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute } from 'vue-router';
import { setLocale, currentLocale } from '@/plugins/i18n/i18n';

const userStore = useUserStore();
const route = useRoute();
const { user } = storeToRefs(userStore);

const toggle = () => {
  setLocale(currentLocale.value === 'en' ? 'no' : 'en');
};
</script>
