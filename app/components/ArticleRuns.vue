<script setup lang="ts">
/**
 * Renders one `Run[]` — a paragraph, list item or table cell from a
 * kennisbank article body, or a band of copy on `/het-bedrijf`. See the `Run`
 * type in `data/kennisbank.ts` for why body copy is stored this way instead of
 * markdown or `v-html`.
 *
 * Internal links go through `NuxtLink` so they route client-side and pick up
 * the trailing slash the rest of the app appends; anything with a scheme or a
 * fragment stays a plain `<a>`.
 */
import type { Run } from '~/data/kennisbank'

defineProps<{ runs: readonly Run[] }>()

const isInternal = (href: string) => href.startsWith('/')
</script>

<template>
  <template v-for="(run, i) in runs" :key="i">
    <template v-if="typeof run === 'object' && run.link">
      <NuxtLink v-if="isInternal(run.link)" :to="run.link">{{ run.text }}</NuxtLink>
      <a v-else :href="run.link">{{ run.text }}</a>
    </template>
    <strong v-else-if="typeof run === 'object' && run.bold">{{ run.text }}</strong>
    <em v-else-if="typeof run === 'object' && run.em">{{ run.text }}</em>
    <sub v-else-if="typeof run === 'object' && run.sub">{{ run.text }}</sub>
    <template v-else>{{ typeof run === 'string' ? run : run.text }}</template>
  </template>
</template>
