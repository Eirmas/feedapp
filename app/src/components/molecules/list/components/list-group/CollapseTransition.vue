<template>
  <transition :name="name" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
    <slot></slot>
  </transition>
</template>

<script lang="ts" setup>
// https://github.com/ivanvermeyen/vue-collapse-transition
import { computed, ref, watch } from 'vue';

type StringProperties<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type ICache = Partial<Record<keyof StringProperties<CSSStyleDeclaration>, string>>;

interface Props {
  name?: string;
  dimension?: 'height' | 'width';
  duration?: number;
  easing?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: 'collapse',
  dimension: 'height',
  duration: 100,
  easing: 'ease-in-out',
});

const cachedStyles = ref<ICache | null>(null);

watch(
  () => props.dimension,
  () => clearCachedDimensions(),
);

const transition = computed(() => {
  const transitions: Array<string> = [];

  Object.keys(cachedStyles.value ?? {}).forEach(key => {
    transitions.push(`${convertToCssProperty(key)} ${props.duration}ms ${props.easing}`);
  });

  return transitions.join(', ');
});

const enter = (el: HTMLElement, done: () => void) => {
  detectAndCacheDimensions(el);
  setClosedDimensions(el);
  hideOverflow(el);
  forceRepaint(el);
  setTransition(el);
  setOpenedDimensions(el);
  setTimeout(done, props.duration);
};

const afterEnter = (el: HTMLElement) => {
  unsetOverflow(el);
  unsetTransition(el);
  unsetDimensions(el);
  clearCachedDimensions();
};

const leave = (el: HTMLElement, done: () => void) => {
  detectAndCacheDimensions(el);
  setOpenedDimensions(el);
  hideOverflow(el);
  forceRepaint(el);
  setTransition(el);
  setClosedDimensions(el);
  setTimeout(done, props.duration);
};

const afterLeave = (el: HTMLElement) => {
  unsetOverflow(el);
  unsetTransition(el);
  unsetDimensions(el);
  clearCachedDimensions();
};

const detectAndCacheDimensions = (el: HTMLElement) => {
  if (cachedStyles.value) return;
  const visibility = el.style.visibility;
  const display = el.style.display;
  el.style.visibility = 'hidden';
  el.style.display = '';
  cachedStyles.value = detectRelevantDimensions(el);
  el.style.visibility = visibility;
  el.style.display = display;
};

const clearCachedDimensions = () => {
  cachedStyles.value = null;
};

const detectRelevantDimensions = (el: HTMLElement): ICache => {
  if (props.dimension === 'height') {
    return {
      height: el.offsetHeight + 'px',
      paddingTop: el.style.paddingTop || getCssValue(el, 'padding-top'),
      paddingBottom: el.style.paddingBottom || getCssValue(el, 'padding-bottom'),
    };
  }

  if (props.dimension === 'width') {
    return {
      width: el.offsetWidth + 'px',
      paddingLeft: el.style.paddingLeft || getCssValue(el, 'padding-left'),
      paddingRight: el.style.paddingRight || getCssValue(el, 'padding-right'),
    };
  }

  return {};
};

const setTransition = (el: HTMLElement) => {
  el.style.transition = transition.value;
};

const unsetTransition = (el: HTMLElement) => {
  el.style.transition = '';
};

const hideOverflow = (el: HTMLElement) => {
  el.style.overflow = 'hidden';
};

const unsetOverflow = (el: HTMLElement) => {
  el.style.overflow = '';
};

const setClosedDimensions = (el: HTMLElement) => {
  Object.keys(cachedStyles.value ?? {}).forEach(key => {
    el.style[key as keyof ICache] = '0';
  });
};

const setOpenedDimensions = (el: HTMLElement) => {
  const cache = cachedStyles.value;
  if (cache) {
    Object.keys(cache).forEach(key => {
      const k = key as keyof ICache;
      const value = cache[k];
      if (value) {
        el.style[k] = value;
      }
    });
  }
};

const unsetDimensions = (el: HTMLElement) => {
  Object.keys(cachedStyles.value ?? {}).forEach(key => {
    el.style[key as keyof ICache] = '';
  });
};

const forceRepaint = (el: HTMLElement) => {
  getComputedStyle(el)[props.dimension];
};

const getCssValue = (el: HTMLElement, style: string) => {
  return getComputedStyle(el, null).getPropertyValue(style);
};

const convertToCssProperty = (_style: string) => {
  let style = _style;
  const upperChars = style.match(/([A-Z])/g);

  if (!upperChars) {
    return style;
  }

  for (let i = 0, n = upperChars.length; i < n; i++) {
    style = style.replace(new RegExp(upperChars[i]), '-' + upperChars[i].toLowerCase());
  }

  if (style.slice(0, 1) === '-') {
    style = style.slice(1);
  }

  return style;
};
</script>
