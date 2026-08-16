<script setup lang="ts">
import type { Tutor } from '~/data/tutors'

withDefaults(defineProps<{ tutor: Tutor; showArrow?: boolean }>(), { showArrow: true })
</script>

<template>
  <NuxtLink
    :to="`/docenten/${tutor.slug}`"
    class="flex flex-col rounded-tile border border-line-ink p-2.5"
  >
    <img
      :src="tutor.photo"
      :alt="tutor.name"
      class="mb-3.5 block aspect-square w-full rounded-field bg-sand object-cover"
      loading="lazy"
    >
    <div class="flex items-center justify-between gap-3 px-1.5 pb-2">
      <div class="min-w-0">
        <p class="text-sm font-bold tracking-[-0.01em]">{{ tutor.name }}</p>
        <p class="text-xs leading-[1.35] text-ink-400">{{ tutor.study }}</p>
      </div>
      <span
        v-if="showArrow"
        class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-field border border-line-ink bg-linen text-sm"
        aria-hidden="true"
      >→</span>
    </div>
  </NuxtLink>
</template>
