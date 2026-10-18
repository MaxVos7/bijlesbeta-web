<script setup lang="ts">
import { mijnLessons } from '~/data/mijn'
import type { MijnLesson } from '~/utils/mijn-types'

/**
 * One lesson on a `/mijn/` page: the lessons list, the overview and a
 * child's page all show them the same way.
 */
withDefaults(
  defineProps<{
    lesson: MijnLesson
    /** The tutor's name — for customers and supervisors, not on a tutor's own lessons. */
    showProvider?: boolean
    /** The student's name — left out on a child's own page, where it is the heading. */
    showReceiver?: boolean
  }>(),
  { showProvider: false, showReceiver: true },
)
</script>

<template>
  <li class="panel flex gap-5 p-5 sm:p-6">
    <!-- Date block, like the rail in the app. -->
    <div class="w-[92px] flex-none border-r border-line-200 pr-4">
      <p class="font-display text-[14px] leading-5 font-bold text-ink-900">{{ lessonDate(lesson.date) }}</p>
      <p v-if="lesson.time_start" class="mt-1 text-[13px] text-ink-700">
        {{ clockTime(lesson.time_start) }}<template v-if="lesson.time_end">–{{ clockTime(lesson.time_end) }}</template>
      </p>
    </div>

    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p v-if="showReceiver" class="font-display text-[16px] font-bold text-ink-900">{{ lesson.receiver.name }}</p>
        <span class="text-[14px] text-ink-700">{{ hoursAndMinutes(lesson.minutes) }}</span>
        <span
          v-if="lesson.is_trial"
          class="rounded-btn bg-brand-500 px-2 py-0.5 font-display text-[12px] font-bold text-ink-900"
        >{{ mijnLessons.trial }}</span>
        <span
          v-if="lesson.has_travel_allowance"
          class="rounded-btn border border-black/10 px-2 py-0.5 font-display text-[12px] font-semibold text-ink-800"
        >{{ mijnLessons.travel }}</span>
      </div>

      <p v-if="showProvider" class="mt-1 text-[13px] text-ink-700">
        {{ mijnLessons.provider }}: {{ lesson.provider.name }}
      </p>

      <p
        v-if="lesson.record_body"
        class="mt-2 line-clamp-2 text-[14px] leading-relaxed text-ink-700"
        :title="lesson.record_body"
      >
        <span class="font-semibold text-ink-800">{{ mijnLessons.record }}:</span> {{ lesson.record_body }}
      </p>
    </div>
  </li>
</template>
