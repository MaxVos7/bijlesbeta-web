<script setup lang="ts">
import { rating } from '~/data/site'

withDefaults(
  defineProps<{
    centered?: boolean
    /** `inverse` lightens the review count for use on a dark ground. */
    tone?: 'default' | 'inverse'
  }>(),
  { centered: false, tone: 'default' },
)
</script>

<template>
  <p
    class="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-sm"
    :class="centered && 'justify-center'"
  >
    <strong class="font-bold">{{ rating.label }}</strong>
    <span class="sr-only">{{ rating.stars }} van de 5 sterren</span>
    <span class="text-[15px] tracking-[2px] text-accent-500" aria-hidden="true">
      {{ '★'.repeat(rating.stars) }}
    </span>
    <span :class="tone === 'inverse' ? 'text-white/70' : 'text-ink-500'">{{ rating.count }}</span>
  </p>
</template>
