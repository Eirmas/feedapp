<template>
  <Main>
    <div v-if="poll" class="flex flex-col gap-y-8">
      <div
        v-if="poll.ownerId === user?.id"
        class="bg-primary-lighter flex flex-wrap items-center gap-2 text-primary-dark p-4 rounded-sm border border-primary-dark"
      >
        <div class="flex grow gap-x-2">
          <InformationCircleIcon class="h-6" />
          <p class="text-body-bold">{{ $t('poll.ownerContext') }}</p>
        </div>
        <div class="flex gap-x-2">
          <Button v-if="poll.status === 'open'" corners="square" size="small" @click="closePoll">{{ $t('common.close') }}</Button>
          <RouterLink v-slot="{ href, navigate }" :to="{ name: 'Edit Poll', params: { pollId: poll.id } }" custom>
            <Button v-if="poll.status === 'open'" corners="square" :href="href" tag="a" size="small" @click="navigate">{{
              $t('common.edit')
            }}</Button>
          </RouterLink>
          <Button corners="square" size="small" @click="deletePoll">{{ $t('common.delete') }}</Button>
        </div>
      </div>
      <div
        v-if="poll.status === 'closed'"
        class="bg-semantic-info-light flex items-center gap-x-2 text-semantic-info-dark p-4 rounded-sm border border-semantic-info-dark"
      >
        <InformationCircleIcon class="h-6" />
        <p class="text-body-bold">{{ $t('poll.closedPoll') }}</p>
      </div>
      <div class="flex gap-4 items-center flex-wrap-reverse">
        <div class="grow">
          <h1 class="text-h3 md:text-h2 mb-2">{{ poll.title }}</h1>
          <p class="text-body-bold">
            {{ $t('common.createdTimestamp', { ago: timestampToDate(poll.createdAt) }) }}
            <span v-if="poll.createdAt !== poll.updatedAt" class="text-body"
              >({{ $t('common.updatedTimestamp', { ago: timestampToDate(poll.updatedAt) }) }})</span
            >
          </p>
        </div>
        <div class="flex gap-x-2 items-center">
          <Avatar :src="poll.ownerAvatar" :name="poll.ownerName" size="large"></Avatar>
          <div>
            <p class="text-body-small">{{ $t('common.createdBy') }}</p>
            <p class="text-body-bold">{{ poll.ownerName }}</p>
          </div>
        </div>
      </div>
      <Card :class="['flex flex-col gap-y-4', loading && 'opacity-50 pointer-events-none']">
        <h3 class="text-body-large-bold md:text-h3">{{ poll.question }}</h3>
        <p class="text-body-small md:text-body">{{ $t('poll.addYourVote') }}:</p>
        <div class="flex gap-x-2">
          <Button
            iconMode="fab"
            size="medium"
            corners="square"
            :icon="HandThumbUpIcon"
            :disabled="poll.status === 'closed'"
            @click="vote(true)"
            >{{ $t('common.yes') }}</Button
          >
          <div class="grow rounded-xs overflow-hidden border border-semantic-success-dark relative">
            <div class="h-full flex bg-semantic-success-light transition-[width]" :style="`width: ${votePercentages.yes}`"></div>
            <span class="absolute top-1/2 -translate-y-1/2 text-semantic-success-dark text-body-bold flex items-center pl-4"
              >{{ votes.yes }} ({{ votePercentages.yes }})</span
            >
          </div>
        </div>
        <div class="flex gap-x-2">
          <Button
            iconMode="fab"
            size="medium"
            corners="square"
            :icon="HandThumbDownIcon"
            :disabled="poll.status === 'closed'"
            @click="vote(false)"
            >{{ $t('common.no') }}</Button
          >
          <div class="grow rounded-xs overflow-hidden border border-semantic-error-dark relative">
            <div class="h-full flex bg-semantic-error-light transition-[width]" :style="`width: ${votePercentages.no}`"></div>
            <span class="absolute top-1/2 -translate-y-1/2 text-semantic-error-dark text-body-bold flex items-center pl-4"
              >{{ votes.no }} ({{ votePercentages.no }})</span
            >
          </div>
        </div>
      </Card>
      <div v-if="poll" class="grid gridcols-1 md:grid-cols-2">
        <div class="flex gap-x-2 items-center">
          <TextInput v-model="pollUrl" :label="$t('poll.shareThisPoll')" :icon="LinkIcon" readonly class="grow" />
          <Button :icon="DocumentDuplicateIcon" theme="secondary" corners="square" iconMode="fab" @click="copyToClipboard">{{
            $t('poll.copyPollUrl')
          }}</Button>
        </div>
      </div>
    </div>
    <div v-else class="text-center my-16">
      <p v-debounce class="text-caption text-neutral-medium">{{ $t('common.loadingPoll') }}</p>
    </div>
  </Main>
</template>

<script setup lang="ts">
import Avatar from '@/components/atoms/avatar/Avatar.vue';
import Button from '@/components/atoms/button/Button.vue';
import Card from '@/components/atoms/card/Card.vue';
import TextInput from '@/components/atoms/text-input/TextInput.vue';
import { useNotifications } from '@/composables/useNotifications';
import Main from '@/layout/Main.vue';
import { supabase } from '@/plugins/supabase';
import { ApiPollEntity, ApiPollEntityStatusEnum } from '@/services/api/data-contracts';
import PollService from '@/services/poll';
import VoteService from '@/services/vote';
import { useUserStore } from '@/store/user';
import { DocumentDuplicateIcon, HandThumbDownIcon, HandThumbUpIcon, InformationCircleIcon, LinkIcon } from '@heroicons/vue/24/outline';
import { REALTIME_LISTEN_TYPES, RealtimeChannel } from '@supabase/supabase-js';
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { formatDistance } from 'date-fns';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const router = useRouter();
const props = defineProps<{ pollId: string }>();
const loading = ref(true);
const poll = ref<ApiPollEntity | null>(null);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const syncVotes = ref<{ yes: number; no: number }>({ yes: 0, no: 0 });
const asyncVotes = ref<{ yes: number; no: number }>({ yes: 0, no: 0 });
const subscription = ref<RealtimeChannel | null>(null);

const notifications = useNotifications();
const timestampToDate = (timestamp: string) => formatDistance(new Date(timestamp), new Date(), { addSuffix: true });

const vote = async (answer: boolean) => {
  try {
    asyncVotes.value = {
      ...asyncVotes.value,
      [answer ? 'yes' : 'no']: asyncVotes.value[answer ? 'yes' : 'no'] + 1,
    };
    await VoteService.createVote(props.pollId, answer);
  } catch (err) {
    if ((err as AxiosError<{ message: string }>).response?.data?.message === 'poll_closed' && poll.value) {
      poll.value = {
        ...poll.value,
        status: ApiPollEntityStatusEnum.Closed,
      };
      asyncVotes.value = {
        yes: 0,
        no: 0,
      };
    } else if ((err as AxiosError).response?.status === 403) {
      notifications.error({
        title: $t('notifications.pollNotFound'),
        description: $t('notifications.pollNotFoundDesc', { id: props.pollId }),
      });
      await router.push({ name: 'Not Found' });
    } else {
      notifications.error({ title: $t('notifications.anErrorOccurred') }, err);
    }
  }
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
    loading.value = false;
  } catch (err) {
    if ((err as AxiosError).response?.status === 403) {
      notifications.error({
        title: $t('notifications.pollNotFound'),
        description: $t('notifications.pollNotFoundDesc', { id: props.pollId }),
      });
      await router.push({ name: 'Not Found' });
    } else {
      notifications.error({ title: $t('notifications.anErrorOccurred') }, err);
    }
    loading.value = false;
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

const closePoll = async () => {
  try {
    if (poll.value && user.value?.id === poll.value?.ownerId) {
      await PollService.closePollById(props.pollId);
      poll.value = {
        ...poll.value,
        status: ApiPollEntityStatusEnum.Closed,
      };
    }
  } catch (err) {
    notifications.error({ title: $t('notifications.couldntClosePoll') }, err);
  }
};

const deletePoll = async () => {
  try {
    if (poll.value && user.value?.id === poll.value?.ownerId) {
      await PollService.deletePollById(props.pollId);
      notifications.success({ title: $t('notifications.pollSuccessfullyDeleted') });
      await router.push({ name: 'Home' });
    }
  } catch (err) {
    notifications.error({ title: $t('notifications.couldntDeletePoll') }, err);
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

const pollUrl = computed(() => {
  return `${window.location.origin}/poll/${props.pollId}`;
});

const copyToClipboard = () => {
  try {
    navigator.clipboard.writeText(pollUrl.value);
    notifications.success({ title: $t('notifications.copiedToClipboard'), description: $t('notifications.copiedToClipboardDesc') });
  } catch (err) {
    notifications.error({ title: $t('notifications.couldntCopyToClipboard'), description: $t('notifications.couldntCopyToClipboardDesc') });
  }
};

onBeforeUnmount(() => {
  if (subscription.value) {
    subscription.value.unsubscribe();
  }
});
</script>
