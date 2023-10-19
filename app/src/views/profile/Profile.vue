<template>
  <Main>
    <h2>{{ $t('profile.yourProfile') }}</h2>
    <Card v-if="user" class="mt-8">
      <div class="grid grid-cols-2 p-4">
        <p class="hidden md:block text-body-bold">{{ $t('common.general') }}</p>
        <div class="flex flex-col gap-y-2 col-span-2 md:col-span-1">
          <p class="block md:hidden text-body-bold pb-4">{{ $t('common.general') }}</p>
          <div class="flex gap-x-2">
            <TextInput v-model="name" :label="$t('common.name')" class="grow" :error="nameError" />
            <div class="pt-6">
              <Button corners="square" :disabled="loading || !!nameError || name === user.name" @click="save">{{
                $t('common.save')
              }}</Button>
            </div>
          </div>
          <TextInput v-model="user.email" :label="$t('common.email')" readonly />
        </div>
      </div>
    </Card>
    <div v-else class="text-center my-16">
      <p v-debounce class="text-caption text-neutral-medium">{{ $t('profile.loadingUser') }}</p>
    </div>
  </Main>
</template>

<script lang="ts" setup>
import Button from '@/components/atoms/button/Button.vue';
import Card from '@/components/atoms/card/Card.vue';
import TextInput from '@/components/atoms/text-input/TextInput.vue';
import { useNotifications } from '@/composables/useNotifications';
import Main from '@/layout/Main.vue';
import { updateUserSchema } from '@/services/schemas';
import { useUserStore } from '@/store/user';
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { z } from 'zod';

const { t: $t } = useI18n();
const notifications = useNotifications();
const name = ref('');
const loading = ref(false);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

onMounted(() => {
  name.value = user.value?.name ?? '';
});

const nameError = computed(() => {
  try {
    updateUserSchema.parse({
      name: name.value,
    });
    return '';
  } catch (err) {
    if (err instanceof z.ZodError) {
      return err.issues[0].message;
    }

    return 'An unknown error occurred';
  }
});

const save = async () => {
  if (nameError.value) {
    return;
  }

  loading.value = true;

  try {
    await userStore.updateUser({ name: name.value });
  } catch (err) {
    notifications.error({ title: $t('notifications.couldntUpdateUser') }, err as AxiosError);
  }

  loading.value = false;
};
</script>
