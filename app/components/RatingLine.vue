<script setup lang="ts">
import { formatStars } from '#shared/utils/reviews'

/**
 * `Uitstekend ★★★★★ 34 Reviews` — the line under most heroes.
 *
 * The stars and the count are Google's own, through `useReviews()`; the bold
 * label is not. See that composable for why.
 */
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

const { summary } = useReviews()

const leadLabel = computed(() => props.label ?? summary.value.label)
</script>

<template>
  <p
    class="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[15px] leading-[22.5px]"
    :class="[centered && 'justify-center', tone === 'inverse' && 'text-white']"
  >
    <strong class="font-bold">{{ leadLabel }}</strong>
    <!-- A live average is fractional, so this reads "4,8", not "4.8" or "5". -->
    <span class="sr-only">{{ formatStars(summary.stars) }} van de 5 sterren</span>
    <StarRating :value="summary.stars" />
    <span :class="tone === 'inverse' ? 'text-ink-300' : 'text-ink-500'">{{ summary.count }}</span>
  </p>
</template>
