<script setup lang="ts">
import { faqs } from '~/data/site'

const props = withDefaults(
  defineProps<{
    limit?: number
    /** `lg` is the roomier variant used inside the standalone FAQ section. */
    size?: 'md' | 'lg'
  }>(),
  { limit: 0, size: 'md' },
)

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
        class="flex cursor-pointer list-none items-center justify-between gap-5 text-left font-bold leading-snug"
        :class="size === 'lg' ? 'py-[22px] text-[15.5px]' : 'py-5 text-[14.5px]'"
      >
        {{ item.question }}
        <span
          class="flex flex-none items-center justify-center rounded-full bg-mist"
          :class="size === 'lg' ? 'h-[26px] w-[26px]' : 'h-6 w-6'"
        >
          <svg
            class="text-ink-600 transition-transform duration-200 group-open:rotate-180"
            :class="size === 'lg' ? 'h-[13px] w-[13px]' : 'h-3 w-3'"
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
      <p
        class="max-w-[70ch] leading-[1.75] text-ink-700"
        :class="size === 'lg' ? 'mb-6 text-[13.5px]' : 'mb-[22px] text-[13px]'"
      >
        {{ item.answer }}
      </p>
    </details>
  </div>
</template>
