<template>
  <Main>
    <div v-if="poll" class="flex flex-col gap-y-8">
      <div
        v-if="poll.status === 'closed'"
        class="bg-semantic-info-light flex items-center gap-x-2 text-semantic-info-dark p-4 rounded-sm border border-semantic-info-dark"
      >
        <InformationCircleIcon class="h-6" />
        <p>This poll has been closed</p>
      </div>
      <div class="flex gap-4 items-center flex-wrap-reverse">
        <div class="grow">
          <h1 class="mb-2">{{ poll.title }}</h1>
          <p class="text-body-bold">
            Created {{ timestampToDate(poll.createdAt) }}
            <span v-if="poll.createdAt !== poll.updatedAt" class="text-body">(Updated {{ timestampToDate(poll.updatedAt) }})</span>
          </p>
        </div>
        <div class="flex gap-x-2 items-center">
          <Avatar :src="poll.ownerAvatar" :name="poll.ownerName" size="large"></Avatar>
          <div>
            <p class="text-body-small">Created by</p>
            <p class="text-body-bold">{{ poll.ownerName }}</p>
          </div>
        </div>
      </div>
      <Card class="flex flex-col gap-y-4">
        <h3>{{ poll.question }}</h3>
        <p class="text-body">Vote standings:</p>
        <div class="flex gap-x-4">
          <Button size="medium" corners="square" :icon="HandThumbUpIcon" :disabled="poll.status === 'closed'" @click="vote(true)"
            >Yes</Button
          >
          <div class="grow rounded-sm overflow-hidden border-2 border-semantic-success-dark relative">
            <div class="h-full flex bg-semantic-success-light transition-[width]" :style="`width: ${votePercentages.yes}`"></div>
            <span class="absolute top-1/2 -translate-y-1/2 text-semantic-success-dark text-body-bold flex items-center pl-4"
              >{{ votes.yes }} ({{ votePercentages.yes }})</span
            >
          </div>
        </div>
        <div class="flex gap-x-4">
          <Button size="medium" corners="square" :icon="HandThumbDownIcon" :disabled="poll.status === 'closed'" @click="vote(false)"
            >No</Button
          >
          <div class="grow rounded-sm overflow-hidden border-2 border-semantic-error-dark relative">
            <div class="h-full flex bg-semantic-error-light transition-[width]" :style="`width: ${votePercentages.no}`"></div>
            <span class="absolute top-1/2 -translate-y-1/2 text-semantic-error-dark text-body-bold flex items-center pl-4"
              >{{ votes.no }} ({{ votePercentages.no }})</span
            >
          </div>
        </div>
      </Card>
    </div>
  </Main>
</template>

<script setup lang="ts">
import Avatar from '@/components/atoms/avatar/Avatar.vue';
import Button from '@/components/atoms/button/Button.vue';
import Card from '@/components/atoms/card/Card.vue';
import Main from '@/layout/Main.vue';
import { supabase } from '@/plugins/supabase';
import { ApiPollEntity } from '@/services/api/data-contracts';
import PollService from '@/services/poll';
import VoteService from '@/services/vote';
import { HandThumbDownIcon, HandThumbUpIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
import { REALTIME_LISTEN_TYPES, RealtimeChannel } from '@supabase/supabase-js';
import { AxiosError } from 'axios';
import moment from 'moment';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps<{ pollId: string }>();

const poll = ref<ApiPollEntity | null>(null);
const syncVotes = ref<{ yes: number; no: number }>({ yes: 0, no: 0 });
const asyncVotes = ref<{ yes: number; no: number }>({ yes: 0, no: 0 });
const subscription = ref<RealtimeChannel | null>(null);

const timestampToDate = (timestamp: string) => moment(timestamp).fromNow();

const vote = async (answer: boolean) => {
  asyncVotes.value = {
    ...asyncVotes.value,
    [answer ? 'yes' : 'no']: asyncVotes.value[answer ? 'yes' : 'no'] + 1,
  };
  await VoteService.createVote(props.pollId, answer);
};

onMounted(async () => {
  try {
    poll.value = (await PollService.getPollById(props.pollId)).data;
    syncVotes.value = (await VoteService.getVotesByPoll(props.pollId)).data;

    subscription.value = supabase
      .channel(props.pollId)
      .on(REALTIME_LISTEN_TYPES.POSTGRES_CHANGES, { event: 'INSERT', schema: 'public', table: 'votes' }, payload =>
        onNewVote(payload.new.answer),
      )
      .subscribe();
  } catch (err) {
    if ((err as AxiosError).response?.status === 403) {
      await router.push({ name: 'Not Found', query: { msg: `Poll with ID ${props.pollId} was not found` } });
    }

    console.log(err);
  }
});

const onNewVote = (answer: boolean) => {
  if (answer) {
    if (asyncVotes.value.yes > 0) asyncVotes.value.yes--;
    syncVotes.value.yes++;
  } else {
    if (asyncVotes.value.no > 0) asyncVotes.value.no--;
    syncVotes.value.no++;
  }
};

const votes = computed(() => {
  return {
    yes: syncVotes.value.yes + asyncVotes.value.yes,
    no: syncVotes.value.no + asyncVotes.value.no,
  };
});

const votePercentages = computed(() => {
  const getValue = (num: number) => {
    const denominator = votes.value.yes + votes.value.no;

    if (denominator === 0) {
      return 0;
    }

    return ((num / denominator) * 100).toFixed(2);
  };
  return {
    yes: getValue(votes.value.yes) + '%',
    no: getValue(votes.value.no) + '%',
  };
});

onBeforeUnmount(() => {
  if (subscription.value) {
    subscription.value.unsubscribe();
  }
});
</script>
