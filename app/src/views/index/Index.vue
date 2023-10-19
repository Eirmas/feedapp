<template>
  <Main>
    <div class="grid grid-cols-12 gap-0 md:gap-12 h-[calc(100vh-160px)] my-4">
      <div class="mb-8 flex flex-col justify-center gap-y-6 col-span-12 md:col-span-7">
        <h1 class="hidden md:block bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent pb-1">
          {{ $t('index.getStartedToday') }}
        </h1>
        <h2 class="block md:hidden bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent pb-1">
          {{ $t('index.getStartedToday') }}
        </h2>
        <p class="text-body-la text-primary-dark">
          {{ $t('index.ingress') }}
        </p>
        <div class="pt-2">
          <Button @click="login">{{ $t('index.signInWithGoogle') }}</Button>
        </div>
        <Translation keypath="index.agreement" tag="p" class="text-caption">
          <template #termsOfService>
            <RouterLink :to="{ name: 'Terms of Service' }" class="underline text-semantic-link">{{
              $t('index.termsOfService')
            }}</RouterLink>
          </template>
          <template #privacyPolicy>
            <RouterLink :to="{ name: 'Privacy Policy' }" class="underline text-semantic-link">{{ $t('index.privacyPolicy') }}</RouterLink>
          </template>
        </Translation>
      </div>
      <div class="mb-8 hidden md:flex col-span-5 items-center justify-center mx-0">
        <img src="~@/assets/landingpage_illustration.svg" class="w-full" />
      </div>
    </div>
  </Main>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/button/Button.vue';
import Main from '@/layout/Main.vue';
import { login } from '@/services/auth';
import { RouterLink } from 'vue-router';
import { Translation } from 'vue-i18n';
</script>
