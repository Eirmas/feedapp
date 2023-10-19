<template>
  <Main>
    <div class="grid grid-cols-12 gap-0 md:gap-12 my-8">
      <div class="flex flex-col justify-center gap-y-6 col-span-12 md:col-span-7">
        <h2 class="pb-1">{{ $t('home.explorePolls') }}</h2>
        <p class="text-body-la text-primary-dark" v-html="$t('home.ingress')"></p>
        <div class="pt-2">
          <RouterLink v-slot="{ href, navigate }" :to="{ name: 'Create Poll' }" custom>
            <Button tag="a" :href="href" :icon="PlusIcon" iconMode="prepend" @click="navigate">{{ $t('poll.createPoll') }}</Button>
          </RouterLink>
        </div>
      </div>
      <div class="hidden md:flex col-span-5 items-center justify-end mx-0">
        <img src="~@/assets/mascot.svg" class="w-full max-w-xs" />
      </div>
    </div>
    <Tabs :modelValue="mode" @update:model-value="onToggleMode">
      <Tab value="public">{{ $t('home.publicPolls') }}</Tab>
      <Tab value="owner">{{ $t('home.yourPolls') }}</Tab>
    </Tabs>
    <div v-if="polls" :class="['flex flex-col gap-y-2 my-4 transition-opacity', isLoading && 'opacity-50 pointer-events-none']">
      <RouterLink v-for="poll in polls.data" :key="poll.id" :to="`/poll/${poll.id}`" class="rounded-xs focus-outline">
        <Card class="flex hover:bg-primary-lighter transition-colors">
          <div class="flex grow gap-x-2">
            <div class="grow">
              <h3 class="text-body-bold md:text-body-large-bold flex items-center gap-x-2">
                {{ poll.title }}
                <span class="text-caption line-clamp-1">{{ timestampToDate(poll.createdAt) }}</span>
              </h3>
              <p class="text-body-small md:text-body line-clamp-1">{{ poll.question }}</p>
            </div>
            <div class="flex gap-x-2 flex-none items-center mr-4">
              <Badge v-if="poll.private" class="hidden md:block" type="info">{{ $t('common.private') }}</Badge>
              <Badge v-else class="hidden md:block" type="success">{{ $t('common.public') }}</Badge>
              <Badge v-if="poll.status === 'open'" class="hidden md:block" type="success">{{ $t('common.open') }}</Badge>
              <Badge v-else class="hidden md:block" type="error">{{ $t('common.closed') }}</Badge>
              <Avatar :src="poll.ownerAvatar" size="small" :name="poll.ownerName" class="ml-2"></Avatar>
              <div class="hidden md:block">
                <p class="text-caption">{{ $t('common.createdBy') }}</p>
                <p class="text-body-small-bold">{{ poll.ownerName }}</p>
              </div>
            </div>
          </div>
        </Card>
      </RouterLink>
      <div v-if="polls.meta.pageCount > 1" class="flex gap-x-1 self-end">
        <Button
          iconMode="fab"
          corners="square"
          theme="secondary"
          :icon="ChevronLeftIcon"
          :disabled="!polls.meta.hasPreviousPage"
          @click="fetchPolls(currentPage - 1)"
        ></Button>
        <Button
          v-for="page in pageRange"
          :key="page"
          corners="square"
          :theme="page === currentPage ? 'primary' : 'secondary'"
          class="w-10"
          :disabled="page === currentPage"
          @click="fetchPolls(page)"
        >
          {{ page }}
        </Button>
        <Button
          iconMode="fab"
          corners="square"
          theme="secondary"
          :icon="ChevronRightIcon"
          :disabled="!polls.meta.hasNextPage"
          @click="fetchPolls(currentPage + 1)"
        ></Button>
      </div>
    </div>
    <div v-else class="text-center my-16">
      <p v-debounce class="text-caption text-neutral-medium">{{ $t('common.loadingPoll', 2) }}</p>
    </div>
  </Main>
</template>

<script lang="ts" setup>
import Avatar from '@/components/atoms/avatar/Avatar.vue';
import Badge from '@/components/atoms/badge/Badge.vue';
import Button from '@/components/atoms/button/Button.vue';
import Card from '@/components/atoms/card/Card.vue';
import Tab from '@/components/molecules/tabs/Tab.vue';
import Tabs from '@/components/molecules/tabs/Tabs.vue';
import { useNotifications } from '@/composables/useNotifications';
import Main from '@/layout/Main.vue';
import { ApiPageDto, ApiPollEntity } from '@/services/api/data-contracts';
import PollService from '@/services/poll';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { formatDistance } from 'date-fns';
import { useI18n } from 'vue-i18n';

const isLoading = ref(false);
const mode = ref<'public' | 'owner'>('public');
const currentPage = ref(1);
const notifications = useNotifications();
const { t: $t } = useI18n();

const polls = ref<(ApiPageDto & { data: ApiPollEntity[] }) | null>(null);

onMounted(() => {
  fetchPolls(1);
});

const onToggleMode = () => {
  currentPage.value = 1;
  mode.value = mode.value === 'public' ? 'owner' : 'public';
  fetchPolls(1);
};

const timestampToDate = (timestamp: string) => formatDistance(new Date(timestamp), new Date(), { addSuffix: true });

const pageRange = computed(() => {
  const meta = polls.value?.meta;
  if (!meta) {
    return [];
  }

  const pageCount = meta.pageCount;
  const currentPage = meta.page;
  const pageRange = [];

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(pageCount, currentPage + 2);

  if (currentPage <= 3) {
    endPage = Math.min(5, pageCount);
  } else if (currentPage >= pageCount - 2) {
    startPage = Math.max(1, pageCount - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageRange.push(i);
  }

  return pageRange;
});

const fetchPolls = async (page: number) => {
  try {
    const id = setTimeout(() => {
      isLoading.value = true;
    }, 150);
    polls.value = (
      await PollService[mode.value === 'public' ? 'getPublicPolls' : 'getPolls']({
        page,
        take: 10,
      })
    ).data;
    clearTimeout(id);
    isLoading.value = false;
    currentPage.value = page;
  } catch (err) {
    notifications.error({ title: $t('notifications.anErrorOccurred') }, err);
  }
};
</script>
