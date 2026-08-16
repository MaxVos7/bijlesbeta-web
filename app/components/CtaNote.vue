<script setup lang="ts">
import { reassurance } from '~/data/site'

/**
 * The reassurance line under a primary CTA — "100% gratis, je zit nergens aan
 * vast".
 *
 * In the design this is a component, not page copy: the same two-tone line
 * sits under every primary call to action on every board — the hero, all four
 * package buttons, both forms and the closing block. The lead clause is bold
 * and the rest is muted, which is what makes it read as a reassurance rather
 * than as a caption.
 *
 * It is 12px, measured off the boards (11px of ink on a line with descenders,
 * against the 16px hero paragraph's 15px). Before this it was written out at
 * six call sites in two sizes and five different colours, and only
 * `PricingSection` kept the bold/muted split.
 *
 * The split is at the first comma, which is where every variant of the copy
 * divides. A string without one renders muted throughout.
 */
const props = withDefaults(
  defineProps<{
    text?: string
    /** `inverse` is the variant that sits on a dark hero band. */
    tone?: 'default' | 'inverse'
  }>(),
  { text: undefined, tone: 'default' },
)

const parts = computed(() => {
  const value = props.text ?? reassurance
  const at = value.indexOf(',')
  return at === -1
    ? { lead: '', tail: value }
    : { lead: value.slice(0, at), tail: value.slice(at) }
})
</script>

<template>
  <p
    class="text-[12px] leading-[1.6]"
    :class="tone === 'inverse' ? 'text-white/65' : 'text-ink-700'"
  >
    <strong
      v-if="parts.lead"
      class="font-bold"
      :class="tone === 'inverse' ? 'text-white' : 'text-ink-800'"
    >{{ parts.lead }}</strong>{{ parts.tail }}
  </p>
</template>
