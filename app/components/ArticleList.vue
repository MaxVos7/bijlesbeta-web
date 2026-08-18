<script setup lang="ts">
/**
 * A `list` block from a kennisbank article body.
 *
 * Recursive because one article nests: the worked example in
 * `/kennisbank/technieken-voor-differentieren` hangs a `<ul>` of sub-steps
 * under the second item of an `<ol>`, exactly as the live page does.
 */
import type { ArticleList, Run } from '~/data/kennisbank'

defineProps<{ list: ArticleList }>()

const runsOf = (item: ArticleList['items'][number]): readonly Run[] =>
  Array.isArray(item) ? item : item.text
const childrenOf = (item: ArticleList['items'][number]): ArticleList | null =>
  Array.isArray(item) ? null : item.children
</script>

<template>
  <component :is="list.ordered ? 'ol' : 'ul'" :class="list.ordered ? 'list-decimal' : 'list-disc'">
    <li v-for="(item, i) in list.items" :key="i">
      <ArticleRuns :runs="runsOf(item)" />
      <ArticleList v-if="childrenOf(item)" :list="childrenOf(item)!" />
    </li>
  </component>
</template>
