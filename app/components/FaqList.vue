<script setup lang="ts">
import { faqs } from '~/data/site'

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 0 })

const items = computed(() => (props.limit > 0 ? faqs.slice(0, props.limit) : faqs))
</script>

<template>
  <!--
    `name` makes this an exclusive accordion natively — opening one answer
    closes the others, with no script. Browsers without support simply allow
    more than one open at a time.
  -->
  <div>
    <details v-for="item in items" :key="item.question" name="faq" class="group border-b border-line-100">
      <summary
        class="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-left text-[14.5px] font-bold leading-snug"
      >
        {{ item.question }}
        <span
          class="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-mist"
        >
          <svg
            class="h-3 w-3 text-ink-600 transition-transform duration-200 group-open:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </summary>
      <p class="mb-[22px] max-w-[70ch] text-[13px] leading-[1.75] text-ink-700">
        {{ item.answer }}
      </p>
    </details>
  </div>
</template>
