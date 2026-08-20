<script setup lang="ts">
import type { Tutor } from '~/data/tutors'

withDefaults(defineProps<{ tutor: Tutor; showArrow?: boolean }>(), { showArrow: true })
</script>

<!--
  Measured off the live loop item (`loop-296`, element `2a1767d`) rather than
  designed: a 12px-padded 8px surface on a 2px `line-ink` rule, 20px between
  the photograph and the meta row, and a photograph that is a flat **300px**
  crop at whatever width the column gives it — not a square aspect. At the
  grid's four columns that is roughly 330×300, which is what makes these read
  as portraits rather than thumbnails.
-->
<template>
  <NuxtLink
    :to="`/docenten/${tutor.slug}`"
    class="flex flex-col gap-5 rounded-tile border-2 border-line-ink p-3"
  >
    <img
      :src="tutor.photo"
      :alt="tutor.name"
      class="block h-[300px] w-full rounded-field bg-sand object-cover object-center"
      loading="lazy"
    >
    <div class="flex items-center justify-between gap-3 px-2 pb-2">
      <div class="min-w-0">
        <p class="text-[16px] leading-[26px] font-bold tracking-[-0.01em] text-ink-850">
          {{ tutor.name }}
        </p>
        <p class="text-[13px] leading-[1.35] text-ink-600">{{ tutor.study }}</p>
      </div>
      <span
        v-if="showArrow"
        class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-field border border-line-ink bg-linen text-sm"
        aria-hidden="true"
      >→</span>
    </div>
  </NuxtLink>
</template>
