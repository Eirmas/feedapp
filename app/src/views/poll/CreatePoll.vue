<template>
  <Main>
    <h2>{{ $t('poll.createPoll') }}</h2>
    <div>
      <Card v-if="poll" class="mt-8">
        <div class="grid grid-cols-2 p-4">
          <p class="hidden md:block text-body-bold">{{ $t('common.general') }}</p>
          <div class="flex flex-col gap-y-2 col-span-2 md:col-span-1">
            <p class="block md:hidden text-body-bold pb-4">{{ $t('common.general') }}</p>
            <div class="flex gap-x-2">
              <TextInput
                v-model="poll.title"
                autofocus
                :label="$t('common.title')"
                class="grow"
                :disabled="loading"
                :error="errors.title?.[0]"
              />
            </div>
            <div class="flex gap-x-2">
              <TextInput
                v-model="poll.question"
                :label="$t('common.question')"
                class="grow"
                :disabled="loading"
                :error="errors.question?.[0]"
              />
            </div>
          </div>
        </div>
        <hr class="border-neutral-light -mx-4 py-2" />
        <div class="grid grid-cols-2 p-4">
          <p class="hidden md:block text-body-bold">{{ $t('common.access') }}</p>
          <div class="flex flex-col gap-y-2 col-span-2 md:col-span-1">
            <p class="block md:hidden text-body-bold pb-4">{{ $t('common.access') }}</p>
            <div class="flex gap-x-2">
              <label class="flex items-center gap-x-2 pb-4">
                <Switch v-model="poll.private" :disabled="loading"></Switch>
                <span :class="['text-body-small-bold', loading && 'text-neutral-medium']">{{ $t('common.private') }}</span>
              </label>
            </div>
            <div :class="[!poll.private && 'opacity-50 select-none pointer-events-none']">
              <div class="flex gap-x-2">
                <TextInput
                  v-model="email"
                  :label="$t('common.email')"
                  class="grow"
                  type="email"
                  :disabled="!poll.private"
                  :error="emailError"
                  @keyup.enter.stop="addEmail"
                />
                <div class="pt-6">
                  <Button corners="square" :disabled="loading || !!emailError || !!poll.emails?.includes(email)" @click="addEmail">{{
                    $t('common.giveInvite')
                  }}</Button>
                </div>
              </div>
              <div class="mt-2">
                <p class="text-body-small-bold">{{ $t('poll.sentInvites') }}:</p>
                <ul>
                  <li
                    v-for="invite in poll.emails"
                    :key="invite"
                    class="flex items-center justify-between py-2 border-b border-neutral-light last:border-b-0"
                  >
                    <span>{{ invite }}</span>
                    <Button theme="tertiary" size="small" :icon="XMarkIcon" iconMode="fab" @click="removeEmail(invite)"></Button>
                  </li>
                  <span v-if="!poll.emails?.length" class="text-caption text-neutral-medium">{{ $t('poll.noInvites') }}</span>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div class="flex my-4 justify-end">
        <Button :disabled="Object.values(errors).length > 0" @click="save">{{ $t('common.create') }}</Button>
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
import PollService from '@/services/poll';
import { createInviteSchema, createPollSchema } from '@/services/schemas';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { z } from 'zod';

const { t: $t } = useI18n();
const notifications = useNotifications();
const router = useRouter();
const loading = ref<boolean>(false);
const showErrors = ref<boolean>(false);
const showEmailErrors = ref<boolean>(false);

const email = ref('');
const poll = ref<z.infer<typeof createPollSchema>>({
  title: '',
  question: '',
  private: false,
  emails: [],
});

const addEmail = (): void => {
  showEmailErrors.value = true;

  if (emailError.value) {
    return notifications.error({ title: $t('notifications.invalidEmail'), description: emailError.value });
  }

  if (poll.value.emails?.includes(email.value)) {
    return notifications.error({
      title: $t('notifications.emailAlreadyInvited'),
      description: $t('notifications.emailAlreadyInvitedDesc'),
    });
  }

  showEmailErrors.value = false;
  poll.value.emails?.push(email.value);
  email.value = '';
};

const removeEmail = (email: string): void => {
  poll.value.emails = poll.value.emails?.filter(e => e !== email);
};

const save = async (): Promise<void> => {
  showErrors.value = true;

  if (Object.values(errors.value).length > 0) {
    return;
  }

  loading.value = true;

  try {
    const { id } = (await PollService.createPoll(poll.value)).data;
    notifications.success({ title: $t('notifications.pollCreated'), description: $t('notifications.pollCreatedDesc') });
    await router.push({ name: 'Poll', params: { pollId: id } });
  } catch (err) {
    notifications.error({ title: $t('notifications.errorCreatingPoll') }, err);
  }

  loading.value = false;
};

const emailError = computed<string>(() => {
  const result = createInviteSchema.safeParse({ email: email.value });

  if (result.success || !showEmailErrors.value) {
    return '';
  }

  return String(result.error.formErrors.fieldErrors.email);
});

const errors = computed(() => {
  const result = createPollSchema.safeParse(poll.value);

  if (result.success || !showErrors.value) {
    return {};
  }

  return result.error.formErrors.fieldErrors;
});
</script>
