<script setup lang="ts">
import { findArticle, relatedArticles } from '~/data/kennisbank'

const route = useRoute()
const article = findArticle(String(route.params.slug))

if (!article) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel niet gevonden', fatal: true })
}

useSeoMeta({
  title: article.title,
  description: article.excerpt,
})

const dateFormatter = new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long' })
const related = relatedArticles(article, 3)

/** Deterministic anchor id for a heading, shared between the body and the table of contents. */
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

type TocEntry = { id: string; text: string; children: TocEntry[] }

const toc = computed<TocEntry[]>(() => {
  const entries: TocEntry[] = []
  for (const block of article.body) {
    if (block.type !== 'heading') continue
    const entry: TocEntry = { id: slugify(block.text), text: block.text, children: [] }
    if (block.level === 3 && entries.length > 0) {
      entries[entries.length - 1]!.children.push(entry)
    } else {
      entries.push(entry)
    }
  }
  return entries
})

// Highlights the heading currently at the top of the viewport in the TOC —
// the design shows one entry highlighted amber, so this makes that real
// instead of hard-coding which one.
const activeId = ref('')

const updateActiveHeading = () => {
  let current = ''
  for (const block of article.body) {
    if (block.type !== 'heading') continue
    const el = document.getElementById(slugify(block.text))
    if (el && el.getBoundingClientRect().top <= 130) current = el.id
  }
  activeId.value = current
}

onMounted(() => {
  updateActiveHeading()
  window.addEventListener('scroll', updateActiveHeading, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})
</script>

<template>
  <div v-if="article">
    <section class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(20px,3vw,34px)] pb-[clamp(48px,6vw,72px)]">
      <div class="mx-auto max-w-[1180px]">
        <div class="overflow-hidden rounded-panel bg-cream">
          <img
            v-if="article.coverImage"
            :src="article.coverImage"
            :alt="`Cover: ${article.title}`"
            class="block aspect-[5.1] w-full object-cover"
          >
          <ArticleCoverPlaceholder v-else aspect="5.1" />

          <div class="px-[clamp(16px,2vw,22px)] pt-[18px] pb-[22px]">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in article.tags"
                :key="tag"
                class="rounded-btn border border-brand-500 px-2.5 py-[5px] text-xs font-semibold whitespace-nowrap text-brand-700"
              >{{ tag }}</span>
            </div>
            <div class="mt-3 flex items-start justify-between gap-6">
              <div class="min-w-0">
                <h1 class="text-[clamp(24px,2.9vw,30px)]">{{ article.title }}</h1>
                <p class="mt-2 flex flex-wrap gap-5 text-[12.5px] text-ink-700">
                  <span>{{ dateFormatter.format(new Date(article.publishedAt)) }}</span>
                  <span>Leestijd: {{ article.readingMinutes }} minuten ({{ article.wordCount }} woorden)</span>
                </p>
              </div>
              <div class="flex flex-none items-center gap-2.5">
                <span class="h-[34px] w-[34px] flex-none rounded-btn bg-line-300" aria-hidden="true" />
                <span class="text-[13.5px] font-bold">{{ article.author }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div class="order-2 min-w-0 lg:order-1">
            <div v-if="article.body.length" class="article-prose">
              <template v-for="(block, i) in article.body" :key="i">
                <component
                  :is="`h${block.level ?? 2}`"
                  v-if="block.type === 'heading'"
                  :id="slugify(block.text)"
                  class="scroll-mt-28"
                >{{ block.text }}</component>

                <p v-else-if="block.type === 'paragraph'"><ArticleRuns :runs="block.text" /></p>

                <component :is="block.ordered ? 'ol' : 'ul'" v-else-if="block.type === 'list'" :class="block.ordered ? 'list-decimal' : 'list-disc'">
                  <li v-for="(item, li) in block.items" :key="li"><ArticleRuns :runs="item" /></li>
                </component>

                <table v-else-if="block.type === 'table'">
                  <thead>
                    <tr>
                      <th v-for="(col, ci) in block.columns" :key="ci" :class="ci > 0 ? 'text-center' : ''">{{ col }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, ri) in block.rows" :key="ri">
                      <th>{{ row.header }}</th>
                      <td v-for="(cell, ci) in row.cells" :key="ci"><ArticleRuns :runs="cell" /></td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </div>
            <p v-else class="max-w-[70ch] text-[15px] leading-relaxed text-ink-700">
              {{ article.excerpt }}
            </p>
          </div>

          <aside v-if="toc.length" class="order-1 rounded-panel bg-cream p-4 lg:sticky lg:top-[100px] lg:order-2">
            <div class="flex items-center justify-between gap-3">
              <p class="font-display text-[14.5px] font-bold">Inhoudsopgave</p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-[13px] w-[13px]">
                <path d="M6 15l6-6 6 6" />
              </svg>
            </div>
            <ol class="mt-3.5 pl-5 text-[11.5px] leading-[1.45]">
              <li v-for="entry in toc" :key="entry.id" class="mb-2">
                <a :href="`#${entry.id}`" :class="activeId === entry.id ? 'text-brand-700' : ''">{{ entry.text }}</a>
                <ol v-if="entry.children.length" class="mt-2 pl-[18px]">
                  <li v-for="child in entry.children" :key="child.id" class="mb-2">
                    <a :href="`#${child.id}`" :class="activeId === child.id ? 'text-brand-700' : ''">{{ child.text }}</a>
                  </li>
                </ol>
              </li>
            </ol>
          </aside>
        </div>
      </div>
    </section>

    <section v-if="related.length" class="bg-sand px-[clamp(16px,4vw,24px)] py-[clamp(48px,6vw,72px)]">
      <div class="mx-auto max-w-[1180px]">
        <h2 class="mb-[clamp(20px,2.6vw,30px)] text-[clamp(24px,2.9vw,33px)]">Lees ook eens…</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article v-for="item in related" :key="item.slug" class="flex flex-col rounded-card bg-white p-3.5">
            <div class="relative">
              <img
                v-if="item.coverImage"
                :src="item.coverImage"
                :alt="`Cover: ${item.title}`"
                class="block aspect-[2.45] w-full rounded-panel object-cover"
              >
              <ArticleCoverPlaceholder v-else aspect="2.45" class="rounded-panel" />
              <div class="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-2">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="rounded-btn border border-brand-500 px-2.5 py-[5px] text-xs font-semibold whitespace-nowrap text-brand-700"
                >{{ tag }}</span>
              </div>
            </div>
            <p class="mt-3.5 text-xs text-ink-700">{{ dateFormatter.format(new Date(item.publishedAt)) }}</p>
            <h3 class="mt-1 mb-2 text-[17px] tracking-[-0.01em] [line-height:1.3]">
              <NuxtLink :to="`/kennisbank/${item.slug}`">{{ item.title }}</NuxtLink>
            </h3>
            <p class="text-[12.5px] leading-[1.55] text-ink-700">{{ item.excerpt }}</p>
            <div class="mt-auto flex items-center gap-2.5 pt-[18px]">
              <span class="h-8 w-8 flex-none rounded-btn bg-line-300" aria-hidden="true" />
              <span class="text-[13px] font-bold">{{ item.author }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <FaqSection />
  </div>
</template>
