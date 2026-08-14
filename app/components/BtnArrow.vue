<script setup lang="ts">
/**
 * The arrow that trails every in-page CTA on bijlesbeta.nl — Font Awesome's
 * `arrow-right`, drawn at 15×14.
 *
 * It exists as a component rather than a `→` character because the glyph's
 * line box, not the padding, is what sets a `btn-lg`'s height: a text arrow
 * brings a 28px line box with it and the button grows from 54px to 68px.
 */
</script>

<template>
  <svg
    class="h-3.5 w-[15px] flex-none"
    viewBox="0 0 448 512"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
    />
  </svg>
</template>
