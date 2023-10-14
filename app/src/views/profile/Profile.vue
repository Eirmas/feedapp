<template>
  <Main>
    <h2>Your Profile</h2>
    <Card v-if="user" class="mt-8">
      <div class="grid grid-cols-2 p-4">
        <p class="hidden md:block text-body-bold">General</p>
        <div class="flex flex-col gap-y-2 col-span-2 md:col-span-1">
          <p class="block md:hidden text-body-bold pb-4">General</p>
          <div class="flex gap-x-2">
            <TextInput v-model="name" label="Name" class="grow" :error="nameError" />
            <div class="pt-6">
              <Button corners="square" :disabled="loading || !!nameError || name === user.name" @click="save">Save</Button>
            </div>
          </div>
          <TextInput v-model="user.email" label="Email" readonly />
        </div>
      </div>
    </Card>
  </Main>
</template>

<script lang="ts" setup>
import Button from '@/components/atoms/button/Button.vue';
import Card from '@/components/atoms/card/Card.vue';
import TextInput from '@/components/atoms/text-input/TextInput.vue';
import Main from '@/layout/Main.vue';
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { z } from 'zod';

const name = ref('');
const loading = ref(false);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

onMounted(() => {
  name.value = user.value?.name ?? '';
});

const nameSchema = z.string().min(1, 'Name must not be empty').max(255, 'Name must be less than 64 characters');

const nameError = computed(() => {
  try {
    nameSchema.parse(name.value);
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
  await userStore.updateUser({ name: name.value });
  loading.value = false;
};
</script>
