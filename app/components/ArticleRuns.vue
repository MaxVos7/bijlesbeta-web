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

type StyledRun = Extract<Run, { text: string }>

defineProps<{ runs: readonly Run[] }>()

const isInternal = (href: string) => href.startsWith('/')
const isTex = (run: Run): run is { tex: string } => typeof run === 'object' && 'tex' in run
const isBreak = (run: Run): run is { br: true } => typeof run === 'object' && 'br' in run
const styled = (run: Run): StyledRun | null =>
  typeof run === 'object' && 'text' in run ? run : null
</script>

<template>
  <template v-for="(run, i) in runs" :key="i">
    <TeX v-if="isTex(run)" :tex="run.tex" />
    <br v-else-if="isBreak(run)">
    <template v-else-if="styled(run)?.link">
      <NuxtLink v-if="isInternal(styled(run)!.link!)" :to="styled(run)!.link">{{ styled(run)!.text }}</NuxtLink>
      <a v-else :href="styled(run)!.link">{{ styled(run)!.text }}</a>
    </template>
    <strong v-else-if="styled(run)?.bold">{{ styled(run)!.text }}</strong>
    <em v-else-if="styled(run)?.em">{{ styled(run)!.text }}</em>
    <sub v-else-if="styled(run)?.sub">{{ styled(run)!.text }}</sub>
    <sup v-else-if="styled(run)?.sup">{{ styled(run)!.text }}</sup>
    <template v-else>{{ typeof run === 'string' ? run : styled(run)?.text }}</template>
  </template>
</template>
