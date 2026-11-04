<script setup lang="ts">
import { mijnPackages } from '~/data/mijn'

/**
  The weeks a period runs through, one block each: lesson weeks numbered on
  amber, holiday weeks hatched and unnumbered, so a holiday in the middle shows
  as a gap the package waits out rather than as a week that is paid for.
*/
const props = defineProps<{ weeks: { week: string, starts_on: string, holiday: string | null }[] }>()
const copy = mijnPackages.periodWeeks

const blocks = computed(() => {
  let lesson = 0
  return props.weeks.map(w => ({ ...w, lesson: w.holiday ? null : ++lesson, number: weekNumber(w.week) }))
})
const hasHoliday = computed(() => props.weeks.some(w => w.holiday))
</script>

<template>
  <div>
    <ol class="grid auto-cols-fr grid-flow-col gap-1.5" :aria-label="copy.label">
      <li
        v-for="b in blocks"
        :key="b.week"
        class="flex min-w-0 flex-col rounded-field px-2 py-2.5 text-center"
        :class="b.holiday ? 'holiday-week text-ink-700' : 'bg-brand-500 text-ink-900'"
      >
        <span class="font-display text-[11px] font-bold uppercase leading-none tracking-[0.04em]">{{ copy.week(b.number) }}</span>
        <span class="mt-1.5 font-display text-[14px] font-bold leading-5">{{ b.holiday ? copy.holiday : copy.lesson(b.lesson!) }}</span>
        <span class="text-[12px] leading-4">{{ weekSpan(b.starts_on) }}</span>
        <span v-if="b.holiday" class="truncate text-[11px] leading-4" :title="b.holiday">{{ b.holiday }}</span>
      </li>
    </ol>
    <p v-if="hasHoliday" class="mt-2 text-[13px] text-ink-700">{{ copy.holidayNote }}</p>
  </div>
</template>

<style scoped>
.holiday-week {
  background: repeating-linear-gradient(135deg, transparent 0 6px, var(--color-line-ink) 6px 8px), var(--color-sand);
  border: 1px dashed var(--color-line-ink);
}
</style>
