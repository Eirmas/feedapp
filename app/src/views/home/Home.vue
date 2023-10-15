<template>
  <Main>
    <div class="grid grid-cols-12 gap-0 md:gap-12 my-4">
      <div class="mb-8 flex flex-col justify-center gap-y-6 col-span-12 md:col-span-7">
        <h2 class="pb-1">Explore polls</h2>
        <p class="text-body-la text-primary-dark">
          Bellow is a list of public polls. Feel free to share your thoughts.<br />Wanna create your own poll? You can do that too!
        </p>
        <div class="pt-2">
          <Button :icon="PlusIcon" iconMode="prepend">Create new poll</Button>
        </div>
      </div>
      <div class="mb-8 hidden md:flex col-span-5 items-center justify-end mx-0">
        <img src="~@/assets/mascot.svg" class="w-full max-w-xs" />
      </div>
    </div>
    <h3>Public polls</h3>
    <div v-if="polls" :class="['flex flex-col gap-y-2 my-4 transition-opacity', isLoading && 'opacity-50 pointer-events-none']">
      <RouterLink v-for="poll in polls.data" :key="poll.id" :to="`/poll/${poll.id}`">
        <Card class="flex hover:bg-primary-lighter transition-colors">
          <div class="flex grow gap-x-2">
            <div class="grow">
              <h3 class="text-body-large-bold flex items-center gap-x-2">
                {{ poll.title }}
                <span class="text-caption line-clamp-1">{{ timestampToDate(poll.createdAt) }}</span>
              </h3>
              <p class="line-clamp-1">{{ poll.question }}</p>
            </div>
            <div class="flex gap-x-2 flex-none items-center mr-4">
              <Badge v-if="poll.status === 'open'" type="success">Open</Badge>
              <Badge v-if="poll.status === 'closed'" type="error">Closed</Badge>
              <Avatar :src="poll.ownerAvatar" size="small" :name="poll.ownerName" class="ml-2"></Avatar>
              <div class="hidden md:block">
                <p class="text-caption">Created by</p>
                <p class="text-body-small-bold">{{ poll.ownerName }}</p>
              </div>
            </div>
          </div>
        </Card>
      </RouterLink>
      <div class="flex gap-x-1 self-end">
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
  </Main>
</template>

<script lang="ts" setup>
import Button from '@/components/atoms/button/Button.vue';
import Card from '@/components/atoms/card/Card.vue';
import Avatar from '@/components/atoms/avatar/Avatar.vue';
import Main from '@/layout/Main.vue';
import { ApiPageDto, ApiPollControllerGetPublicPollsParamsOrderEnum, ApiPollEntity } from '@/services/api/data-contracts';
import PollService from '@/services/poll';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import moment from 'moment';
import Badge from '@/components/atoms/badge/Badge.vue';

const isLoading = ref(false);
const currentPage = ref(1);

const polls = ref<(ApiPageDto & { data: ApiPollEntity[] }) | null>(null);

onMounted(() => {
  fetchPolls(1);
});

const timestampToDate = (timestamp: string) => moment(timestamp).fromNow();

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
  const id = setTimeout(() => {
    isLoading.value = true;
  }, 200);
  polls.value = (await PollService.getPublicPolls({ page, take: 10, order: ApiPollControllerGetPublicPollsParamsOrderEnum.DESC })).data;
  clearTimeout(id);
  isLoading.value = false;
  currentPage.value = page;
};
</script>
