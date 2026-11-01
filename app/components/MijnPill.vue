<script setup lang="ts">
/** A status label in the package screens: green paid, amber open, red problem, grey not yet / over. */
const props = defineProps<{ tone: 'ok' | 'open' | 'grey' | 'bad' }>()

const toneClass = {
  ok: 'bg-success-50 text-success-900',
  open: 'bg-brand-500/20 text-ink-900',
  grey: 'bg-ink-900/10 text-ink-800',
  bad: 'bg-danger/10 text-danger',
}
</script>

<template>
  <span class="inline-flex items-center rounded-full px-3 py-1 font-display text-[13px] font-bold leading-[1.4]" :class="toneClass[props.tone]">
    <slot />
  </span>
</template>
