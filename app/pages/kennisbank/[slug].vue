<script setup lang="ts">
import { findArticle, relatedArticles } from '~/data/kennisbank'

/**
 * Measured against bijlesbeta.nl's article template (`post-169.css`) rather
 * than designed. Things that are the live page's and shouldn't be tidied:
 *
 * - **The H1 is 32px on a 42px line**, the one place the site's 44px leading
 *   doesn't hold, and it runs at 85% of its column so it wraps early.
 * - **Two cards, one ground.** The header card is `parchment` with its cover
 *   bled to the top corners; the content card carries the same 12px radius
 *   and 28px padding but no fill of its own.
 * - **The column split is 80/20 with a 22px gutter, and only above 1025px** —
 *   Elementor stacks it at the tablet floor, which puts the table of contents
 *   *below* the article rather than above it. That is the live behaviour.
 * - **The related-articles grid stretches** (`grid-auto-rows: 1fr` on the
 *   live loop), unlike the overview grid, which doesn't.
 */
const route = useRoute()
const article = findArticle(String(route.params.slug))

if (!article) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel niet gevonden', fatal: true })
}

useSeo({
  title: article.title,
  description: article.excerpt,
  image: article.coverImage,
  type: 'article',
})

useArticleJsonLd(article)

const dateFormatter = new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long' })
const related = relatedArticles(article, 3)
const coverFailed = ref(false)

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
// the live widget marks one entry amber, so this makes that real instead of
// hard-coding which one.
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
    <!-- White runs from the top of the page to the foot of the article; the
         related row and the FAQ below it close on the site's own parchment. -->
    <section class="bg-white px-[clamp(16px,4vw,40px)] pt-[30px] pb-16">
      <div class="mx-auto flex max-w-[1100px] flex-col gap-[22px] desk:flex-row">
        <div class="flex min-w-0 flex-col gap-10 desk:w-4/5 desk:pl-9">
          <!-- Header card -->
          <header class="overflow-hidden rounded-block bg-parchment">
            <img
              v-if="article.coverImage && !coverFailed"
              :src="article.coverImage"
              :alt="`Cover: ${article.title}`"
              class="block h-[200px] w-full object-cover"
              @error="coverFailed = true"
            >
            <ArticleCoverPlaceholder v-else aspect="5.5" class="h-[200px]" />

            <!-- 70/30 with a 36px gutter above 768px, stacked below it. The two
                 widths plus the gutter overshoot 100% on purpose — the live
                 columns are flex children that shrink, not a grid. -->
            <div class="flex flex-col gap-9 p-7 md:flex-row">
              <div class="min-w-0 md:w-[70%]">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="rounded-btn border border-brand-500 px-3 py-1.5 font-display text-[15px] leading-[21px] font-semibold whitespace-nowrap text-brand-500"
                  >{{ tag }}</span>
                </div>

                <h1 class="mt-3 text-[26px] leading-[36px] md:text-[32px] md:leading-[42px] lg:max-w-[85%]">
                  {{ article.title }}
                </h1>

                <div class="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-ink-muted">
                  <span>{{ dateFormatter.format(new Date(article.publishedAt)) }}</span>
                  <span>Leestijd: {{ article.readingMinutes }} minuten ({{ article.wordCount }} woorden)</span>
                </div>
              </div>

              <div class="flex items-center md:w-[30%]">
                <AuthorBadge :name="article.author" />
              </div>
            </div>
          </header>

          <!-- Content card -->
          <div class="rounded-block max-md:p-0 md:p-7">
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
            <p v-else class="article-prose">
              {{ article.excerpt }}
            </p>
          </div>
        </div>

        <!-- Table of contents. Below the article at the tablet floor, as on the live page. -->
        <aside v-if="toc.length" class="desk:w-1/5 desk:pr-9">
          <div class="rounded-[6px] bg-parchment p-4 desk:sticky desk:top-[100px]">
            <div class="flex items-center justify-between gap-3">
              <p class="font-display text-[16px] font-bold text-ink-900">Inhoudsopgave</p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-[13px] w-[13px]">
                <path d="M6 15l6-6 6 6" />
              </svg>
            </div>
            <ol class="mt-3.5 pl-5 text-[13px] leading-[21px]">
              <li v-for="entry in toc" :key="entry.id" class="mb-2">
                <a :href="`#${entry.id}`" class="hover:underline" :class="activeId === entry.id ? 'text-accent-500' : ''">{{ entry.text }}</a>
                <ol v-if="entry.children.length" class="mt-2 pl-[18px]">
                  <li v-for="child in entry.children" :key="child.id" class="mb-2">
                    <a :href="`#${child.id}`" class="hover:underline" :class="activeId === child.id ? 'text-accent-500' : ''">{{ child.text }}</a>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </section>

    <section v-if="related.length" class="bg-parchment px-[clamp(20px,4vw,40px)] py-12">
      <div class="mx-auto flex max-w-[1100px] flex-col gap-6">
        <h2 class="text-[29px]">Lees ook eens…</h2>
        <div class="grid gap-x-6 gap-y-6 md:grid-cols-2 desk:grid-cols-3">
          <ArticleCard v-for="item in related" :key="item.slug" :article="item" stretch />
        </div>
      </div>
    </section>

    <FaqSection />
  </div>
</template>
