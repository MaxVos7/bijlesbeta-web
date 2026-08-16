<script setup lang="ts">
/**
 * The five-star row, in the design's own star amber.
 *
 * Two things here come straight off the design boards rather than from the
 * live site. The stars are `--color-star` (#FEC700), not the brand amber they
 * sit beside — 80 star glyphs across the eight artboards, never once #FFBB00.
 * And they are drawn at a 15px glyph on a 3px gap, which is the 18.4px pitch
 * measured between star centres.
 *
 * Fractional values fill partially: the boards show 4.5 as four whole stars
 * and one half, which the old `'★'.repeat(n)` could only round away. The fill
 * is done by clipping a second copy of the glyph rather than by a gradient, so
 * there are no per-instance SVG ids to keep stable across SSR and hydration.
 *
 * Decorative by design — every caller already supplies its own sr-only
 * sentence, so this renders `aria-hidden`.
 */
const props = withDefaults(
  defineProps<{
    /** Stars filled, 0–5. Fractions are honoured. */
    value: number
    /** Glyph size in px; the gap scales with it. */
    size?: number
    count?: number
  }>(),
  { size: 15, count: 5 },
)

const STAR = 'M10 0l3.09 6.26L20 7.27l-5 4.87 1.18 6.88L10 15.77 3.82 19 5 12.14 0 7.27l6.91-1.01z'

/** Per-star fill fraction, clamped to 0–1. */
const fills = computed(() =>
  Array.from({ length: props.count }, (_, i) => Math.min(1, Math.max(0, props.value - i))),
)
</script>

<template>
  <span
    class="inline-flex align-[-0.125em] text-star"
    :style="{ gap: `${size / 5}px` }"
    aria-hidden="true"
  >
    <span
      v-for="(fill, i) in fills"
      :key="i"
      class="relative block flex-none"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <!-- The unfilled ghost, then the filled glyph clipped to its fraction. -->
      <svg
        class="absolute inset-0 block h-full w-full opacity-25"
        viewBox="0 0 20 19"
        fill="currentColor"
      >
        <path :d="STAR" />
      </svg>
      <span
        v-if="fill > 0"
        class="absolute inset-y-0 left-0 block overflow-hidden"
        :style="{ width: `${fill * 100}%` }"
      >
        <svg
          class="block h-full"
          :style="{ width: `${size}px` }"
          viewBox="0 0 20 19"
          fill="currentColor"
        >
          <path :d="STAR" />
        </svg>
      </span>
    </span>
  </span>
</template>
