<template>
  <Main>
    <h2>Edit poll</h2>
    <div>
      <Card v-if="poll" class="mt-8">
        <div class="grid grid-cols-2 p-4">
          <p class="hidden md:block text-body-bold">General</p>
          <div class="flex flex-col gap-y-2 col-span-2 md:col-span-1">
            <p class="block md:hidden text-body-bold pb-4">General</p>
            <div class="flex gap-x-2">
              <TextInput v-model="title" label="Title" class="grow" :error="errors.title?.[0]" />
              <div class="pt-6">
                <Button corners="square" :disabled="titleLoading || !!errors.title?.[0] || title === poll.title" @click="saveTitle"
                  >Save</Button
                >
              </div>
            </div>
            <div class="flex gap-x-2">
              <TextInput v-model="question" label="Question" class="grow" :error="errors.question?.[0]" />
              <div class="pt-6">
                <Button
                  corners="square"
                  :disabled="questionLoading || !!errors.question?.[0] || question === poll.question"
                  @click="saveQuestion"
                  >Save</Button
                >
              </div>
            </div>
          </div>
        </div>
        <hr class="border-neutral-light -mx-4 py-2" />
        <div class="grid grid-cols-2 p-4">
          <p class="hidden md:block text-body-bold">Access</p>
          <div class="flex flex-col gap-y-2 col-span-2 md:col-span-1">
            <p class="block md:hidden text-body-bold pb-4">General</p>
            <div class="flex gap-x-2">
              <label class="flex items-center gap-x-2 pb-4">
                <Switch :modelValue="isPrivate" :disabled="privateLoading" @update:model-value="onPrivateToggle"></Switch>
                <span :class="['text-body-small-bold', privateLoading && 'text-neutral-medium']">Private</span>
              </label>
            </div>
            <div :class="[!poll.private && 'opacity-50 select-none pointer-events-none']">
              <div class="flex gap-x-2">
                <TextInput
                  v-model="email"
                  label="Email"
                  class="grow"
                  type="email"
                  :disabled="!poll.private"
                  :error="errors.email?.[0]"
                  @keyup.enter.stop="saveEmail"
                />
                <div class="pt-6">
                  <Button
                    corners="square"
                    :disabled="emailLoading || !!errors.email?.[0] || !!poll.invites.find(i => i.email === email.trim())"
                    @click="saveEmail"
                    >Invite</Button
                  >
                </div>
              </div>
              <div>
                <p class="text-body-small-bold">Sent invites:</p>
                <ul>
                  <li
                    v-for="invite in poll.invites"
                    :key="invite.email"
                    class="flex items-center justify-between py-2 border-b border-neutral-light last:border-b-0"
                  >
                    <span>{{ invite.email }}</span>
                    <Button theme="tertiary" size="small" :icon="XMarkIcon" iconMode="fab" @click="deleteInvite(invite.email)"></Button>
                  </li>
                  <span v-if="!poll.invites.length" class="text-caption text-neutral-medium">No invites</span>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div v-else class="text-center my-16">
        <p v-debounce class="text-caption text-neutral-medium">Loading poll</p>
      </div>
    </div>
  </Main>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/button/Button.vue';
import Card from '@/components/atoms/card/Card.vue';
import Switch from '@/components/atoms/switch/Switch.vue';
import TextInput from '@/components/atoms/text-input/TextInput.vue';
import { useNotifications } from '@/composables/useNotifications';
import Main from '@/layout/Main.vue';
import { ApiPollEntity, ApiUpdatePollDto } from '@/services/api/data-contracts';
import InviteService from '@/services/invite';
import PollService from '@/services/poll';
import { createInviteSchema, updatePollSchema } from '@/services/schemas';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { Ref, computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const notifications = useNotifications();
const router = useRouter();
const loading = ref<boolean>(true);
const titleLoading = ref<boolean>(false);
const questionLoading = ref<boolean>(false);
const privateLoading = ref<boolean>(false);
const emailLoading = ref<boolean>(false);
const inviteLoading = ref<boolean>(false);
const poll = ref<ApiPollEntity | null>(null);
const props = defineProps<{ pollId: string }>();

const showEmailErrors = ref<boolean>(false);
const title = ref('');
const question = ref('');
const isPrivate = ref(false);
const email = ref('');

onMounted(async () => {
  try {
    poll.value = (await PollService.getPollById(props.pollId)).data;
    title.value = poll.value.title;
    question.value = poll.value.question;
    isPrivate.value = poll.value.private;
  } catch (err) {
    notifications.error({ title: 'Error fetching poll' }, err);
    await router.push({ name: 'Home' });
  }
  loading.value = false;
});

const onPrivateToggle = (value: boolean) => {
  isPrivate.value = value;
  savePrivate();
};

const saveTitle = async () => {
  const res = await update({ title: title.value }, titleLoading);
  if (res && poll.value) poll.value.title = title.value;
};

const saveQuestion = async () => {
  const res = await update({ question: question.value }, questionLoading);
  if (res && poll.value) poll.value.question = question.value;
};

const savePrivate = async () => {
  const res = await update({ private: isPrivate.value }, privateLoading);
  if (res && poll.value) poll.value.private = isPrivate.value;
};

const saveEmail = async () => {
  showEmailErrors.value = true;

  if (errors.value.email?.[0]) {
    return notifications.error({ title: 'Invalid email', description: errors.value.email?.[0] });
  }

  emailLoading.value = true;

  try {
    const invite = (await InviteService.createInvite(props.pollId, { email: email.value.trim() })).data;

    if (poll.value) {
      poll.value.invites.push(invite);
    }

    showEmailErrors.value = false;
    email.value = '';
  } catch (err) {
    notifications.error({ title: "Couldn't send invite" }, err);
  }

  emailLoading.value = false;
};

const deleteInvite = async (email: string) => {
  inviteLoading.value = true;
  try {
    (await InviteService.deleteInvite(props.pollId, { email })).data;

    if (poll.value) {
      poll.value.invites = poll.value.invites.filter(i => i.email !== email);
    }
  } catch (err) {
    notifications.error({ title: "Couldn't delete invite" }, err);
  }

  inviteLoading.value = false;
};

const update = async (data: ApiUpdatePollDto, loading: Ref<boolean>): Promise<boolean> => {
  loading.value = true;
  let success = true;

  try {
    await PollService.updatePoll(props.pollId, data);
  } catch (err) {
    notifications.error({ title: 'Error updating poll' }, err);
    success = false;
  }

  loading.value = false;
  return success;
};

const errors = computed(() => {
  const pollResult = updatePollSchema.safeParse({
    title: title.value,
    question: question.value,
    private: isPrivate.value,
  });

  const inviteResult = createInviteSchema.safeParse({
    email: email.value,
  });

  let errors: Partial<Record<'title' | 'question' | 'private' | 'email', string[]>> = {};

  if (!pollResult.success) {
    errors = {
      ...errors,
      ...pollResult.error.formErrors.fieldErrors,
    };
  }

  if (!inviteResult.success && showEmailErrors.value) {
    errors = {
      ...errors,
      ...inviteResult.error.formErrors.fieldErrors,
    };
  }

  return errors;
});
</script>
