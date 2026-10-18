<script setup lang="ts">
import type { MijnRecord } from '~/utils/mijn-types'

/**
 * Notes a tutor shared with the guardian, newest first. The API sends them as
 * plain text, so they are rendered as text, line breaks kept.
 */
defineProps<{
  records: MijnRecord[]
  /** Which child a note is about — on the overview, where there may be several. */
  showPerson?: boolean
}>()
</script>

<template>
  <ul class="flex flex-col gap-3">
    <li v-for="record in records" :key="record.id" class="panel p-5 sm:p-6">
      <p class="text-[13px] text-ink-700">
        <span v-if="record.writer_name" class="font-semibold text-ink-800">{{ record.writer_name }}</span>
        <template v-if="showPerson && record.person_name"> · {{ record.person_name }}</template>
        <template v-if="record.created_at"> · {{ longDate(record.created_at) }}</template>
      </p>
      <p class="mt-2 text-[15px] leading-relaxed whitespace-pre-line text-ink-800">{{ record.body }}</p>
    </li>
  </ul>
</template>
