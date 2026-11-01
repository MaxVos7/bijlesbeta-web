<script setup lang="ts">
import type { WeekCell } from '~/data/pakketten'

/**
 * One row of the lesweek diagrams on /pakketten: five equal columns, a cell
 * per week. A holiday is hatched and dashed, a new period sits on sand.
 * Labels are the full words from 640px up; below that they use the same
 * text at a size that fits five columns on a 390px phone.
 */
defineProps<{ cells: readonly WeekCell[] }>()
</script>

<template>
  <div class="grid grid-cols-5 gap-1 sm:gap-1.5">
    <div
      v-for="cell in cells"
      :key="cell.label"
      class="rounded-btn px-1 py-2.5 text-center text-[11px] leading-[1.3] font-semibold break-words sm:text-[13px]"
      :class="[
        cell.span === 2 ? 'col-span-2' : '',
        cell.kind === 'les' && 'bg-brand-500 text-on-brand',
        cell.kind === 'vakantie' &&
          'border border-dashed border-ink-900/20 bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgb(29_29_27/0.14)_6px_8px)] text-ink-700',
        cell.kind === 'nieuw' && 'border border-line-ink bg-sand',
      ]"
    >
      {{ cell.label }}
      <span v-if="cell.note" class="mt-0.5 hidden text-[11px] font-normal sm:block">{{ cell.note }}</span>
    </div>
  </div>
</template>
