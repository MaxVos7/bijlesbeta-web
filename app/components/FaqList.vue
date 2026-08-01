<script setup lang="ts">
import { faqs } from '~/data/site'

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 0 })

const items = computed(() => (props.limit > 0 ? faqs.slice(0, props.limit) : faqs))
</script>

<template>
  <div class="divide-y divide-slate-200 border-y border-slate-200">
    <details v-for="item in items" :key="item.question" class="group py-5">
      <summary
        class="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-slate-900"
      >
        {{ item.question }}
        <svg
          class="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <p class="mt-3 leading-relaxed text-slate-600">{{ item.answer }}</p>
    </details>
  </div>
</template>
