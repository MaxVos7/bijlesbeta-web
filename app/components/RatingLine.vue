<script setup lang="ts">
import { rating } from '~/data/site'

const props = withDefaults(
  defineProps<{
    centered?: boolean
    /** `inverse` is the variant that sits on a dark hero band. */
    tone?: 'default' | 'inverse'
    /** Overrides the bold leading text, e.g. "7 jaar ervaring" on Examentraining. */
    label?: string
  }>(),
  { centered: false, tone: 'default', label: undefined },
)

const leadLabel = computed(() => props.label ?? rating.label)
</script>

<template>
  <p
    class="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[15px] leading-[22.5px]"
    :class="[centered && 'justify-center', tone === 'inverse' && 'text-white']"
  >
    <strong class="font-bold">{{ leadLabel }}</strong>
    <span class="sr-only">{{ rating.stars }} van de 5 sterren</span>
    <StarRating :value="rating.stars" />
    <span :class="tone === 'inverse' ? 'text-ink-300' : 'text-ink-500'">{{ rating.count }}</span>
  </p>
</template>
