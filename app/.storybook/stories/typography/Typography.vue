<template>
  <div v-if="clazz === 'H1' || clazz === 'H2'" :class="Levels[clazz]">Enjoy us for an exciting Stavanger & Preikestolen tour</div>
  <div v-else-if="clazz === 'H3' || clazz === 'H4'" :class="Levels[clazz]">
    Book now, and enjoy us for an exciting Stavanger & Preikestolen tour
  </div>
  <div v-else-if="clazz.includes('Link')" :class="Levels[clazz.replace(' Link', '')]">
    Located near a train station, <a :class="Levels[clazz]" href="#">Radisson Blu Atlantic Hotel, Stavanger</a> is a great choice for a stay
    in Stavanger. Guests can visit the fitness center for a workout or grab a bite to eat at Frokost, which serves breakfast and lunch.
    Fellow travelers like the helpful staff and breakfast.
  </div>
  <div v-else :class="Levels[clazz]">
    Located near a train station, Radisson Blu Atlantic Hotel, Stavanger is a great choice for a stay in Stavanger. Guests can visit the
    fitness center for a workout or grab a bite to eat at Frokost, which serves breakfast and lunch. Fellow travelers like the helpful staff
    and breakfast.
  </div>
</template>

<script lang="ts" setup>
import { Levels } from './typography.stories';

type TypographyLevel = keyof typeof Levels;

interface Props {
  clazz: TypographyLevel;
}

withDefaults(defineProps<Props>(), { clazz: 'H1' });
</script>
