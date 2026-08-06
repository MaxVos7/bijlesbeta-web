<script setup lang="ts">
/**
 * Renders one `Run[]` — a paragraph, list item or table cell from a
 * kennisbank article body. See the `Run` type in `data/kennisbank.ts` for
 * why body copy is stored this way instead of markdown or `v-html`.
 */
import type { Run } from '~/data/kennisbank'

defineProps<{ runs: Run[] }>()
</script>

<template>
  <template v-for="(run, i) in runs" :key="i">
    <a v-if="typeof run === 'object' && run.link" :href="run.link">{{ run.text }}</a>
    <strong v-else-if="typeof run === 'object' && run.bold">{{ run.text }}</strong>
    <em v-else-if="typeof run === 'object' && run.em">{{ run.text }}</em>
    <sub v-else-if="typeof run === 'object' && run.sub">{{ run.text }}</sub>
    <template v-else>{{ typeof run === 'string' ? run : run.text }}</template>
  </template>
</template>
