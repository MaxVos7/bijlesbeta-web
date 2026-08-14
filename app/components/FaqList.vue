<script setup lang="ts">
import { faqs } from '~/data/site'

const props = withDefaults(
  defineProps<{
    limit?: number
    /** `lg` is the roomier variant used inside the standalone FAQ section. */
    size?: 'md' | 'lg'
    /** Overrides the sitewide `faqs` list, e.g. Examentraining's own 3 questions. */
    items?: readonly { question: string; lead?: string; answer: string }[]
  }>(),
  { limit: 0, size: 'md', items: undefined },
)

const items = computed(() => {
  const source = props.items ?? faqs
  return props.limit > 0 ? source.slice(0, props.limit) : source
})
</script>

<template>
  <!--
    `name` makes this an exclusive accordion natively — opening one answer
    closes the others, with no script. Browsers without support simply allow
    more than one open at a time.
  -->
  <div>
    <!-- The first answer stands open on load, as on the live site — the
         accordion reads as an answer with more below it rather than as a
         column of closed rows. -->
    <details
      v-for="(item, index) in items"
      :key="item.question"
      name="faq"
      class="group border-b border-line-100"
      :open="index === 0"
    >
      <!--
        The `lg` row is measured off the live accordion: a 17px question on a
        44px line with 10px of padding around it, and a bare chevron rather
        than one in a grey disc.
      -->
      <summary
        class="flex cursor-pointer list-none items-center justify-between gap-5 text-left font-display font-bold"
        :class="
          size === 'lg'
            ? 'p-2.5 text-[17px] leading-[44px] text-ink-800'
            : 'py-5 text-[14.5px] leading-snug'
        "
      >
        {{ item.question }}
        <span
          class="flex flex-none items-center justify-center"
          :class="size === 'lg' ? 'h-[26px] w-[26px]' : 'h-6 w-6 rounded-full bg-mist'"
        >
          <svg
            class="text-ink-600 transition-transform duration-200 group-open:rotate-90"
            :class="size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </span>
      </summary>
      <p
        :class="
          size === 'lg'
            ? 'px-6 pt-3 pb-6 text-[14px] leading-[21px] text-ink-800'
            : 'mb-[22px] max-w-[70ch] text-[13px] leading-[1.75] text-ink-700'
        "
      >
        <!-- The live answers open on a bold affirmation — "Ja!", "Dat kan
             zeker!" — carried as its own field so it stays out of the plain
             answer text. -->
        <strong v-if="item.lead">{{ item.lead }}</strong>{{ item.lead ? ' ' : '' }}{{ item.answer }}
      </p>
    </details>
  </div>
</template>
