<script setup lang="ts">
import type { Tutor } from '~/data/tutors'

withDefaults(defineProps<{ tutor: Tutor; showArrow?: boolean }>(), { showArrow: true })
</script>

<template>
  <NuxtLink
    :to="`/docenten/${tutor.slug}`"
    class="flex flex-col rounded-tile border border-line-200 p-2.5 transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_28px_rgb(31_29_28_/_0.09)]"
  >
    <img
      :src="tutor.photo"
      :alt="tutor.name"
      class="mb-3.5 block aspect-square w-full rounded-lg bg-sand object-cover"
      loading="lazy"
    >
    <div class="flex items-center justify-between gap-3 px-1.5 pb-2">
      <div class="min-w-0">
        <p class="text-sm font-bold tracking-[-0.01em]">{{ tutor.name }}</p>
        <p class="text-xs leading-[1.35] text-ink-400">{{ tutor.study }}</p>
      </div>
      <span
        v-if="showArrow"
        class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-lg border border-line-200 text-sm"
        aria-hidden="true"
      >→</span>
    </div>
  </NuxtLink>
</template>
