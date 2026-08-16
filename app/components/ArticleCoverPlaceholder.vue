<script setup lang="ts">
/**
 * Stand-in for a kennisbank cover image while no artwork has been supplied
 * — same dashed-box-plus-glyph pattern as the examentraining feature cards.
 */
defineProps<{ aspect: string }>()
</script>

<template>
  <div
    class="flex w-full items-center justify-center border border-dashed border-line-300 bg-linen"
    :style="{ aspectRatio: aspect }"
    aria-hidden="true"
  >
    <svg
      class="h-8 w-8 text-ink-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  </div>
</template>
