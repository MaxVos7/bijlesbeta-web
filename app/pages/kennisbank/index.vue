<script setup lang="ts">
import { articles, filterTags, type Article } from '~/data/kennisbank'

useSeoMeta({
  title: 'Kennisbank',
  description:
    'Op onze kennisbank leggen onze eigen docenten onderwerpen uit aan de hand van een voorbeeldvraag en een duidelijke uitleg.',
})

const chips = ['Alle artikelen', ...filterTags] as const
const activeTag = ref<(typeof chips)[number]>('Alle artikelen')

const visibleArticles = computed(() =>
  activeTag.value === 'Alle artikelen'
    ? articles
    : articles.filter((article) => article.tags.includes(activeTag.value)),
)

const dateFormatter = new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long' })
const formatDate = (value: string) => dateFormatter.format(new Date(value))

// The wide two-up card only reads well as the unfiltered grid's fifth tile —
// once a chip narrows the set, every card falls back to the normal layout.
function isFeatured(article: Article) {
  return activeTag.value === 'Alle artikelen' && article.slug === 'rekenen-met-procenten'
}
</script>

<template>
  <div>
    <PageHero
      title="Onze kennisbank"
      intro="Op onze kennisbank leggen onze eigen docenten onderwerpen uit aan de hand van een voorbeeldvraag en een duidelijke uitleg."
    />

    <section class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(48px,6vw,68px)] pb-[clamp(56px,7vw,88px)]">
      <div class="mx-auto max-w-[1180px]">
        <div class="flex flex-wrap gap-2.5" role="group" aria-label="Filter op categorie">
          <button
            v-for="chip in chips"
            :key="chip"
            type="button"
            class="rounded-btn border px-4 py-[11px] text-[13.5px] transition"
            :class="
              activeTag === chip
                ? 'border-brand-500 bg-brand-500 font-bold text-ink-700'
                : 'border-line-200 bg-cream font-medium text-ink-700 hover:border-line-400'
            "
            :aria-pressed="activeTag === chip"
            @click="activeTag = chip"
          >
            {{ chip }}
          </button>
        </div>

        <div class="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <template v-for="article in visibleArticles" :key="article.slug">
            <article
              v-if="isFeatured(article)"
              class="grid items-center gap-5 rounded-card bg-sand p-3 sm:col-span-2 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]"
            >
              <div class="relative">
                <img
                  v-if="article.coverImage"
                  :src="article.coverImage"
                  :alt="`Cover: ${article.title}`"
                  class="block aspect-[1.02] w-full rounded-panel object-cover"
                >
                <ArticleCoverPlaceholder v-else aspect="1.02" class="rounded-panel" />
                <div class="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-2">
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="rounded-btn border border-brand-500 px-2.5 py-[5px] text-xs font-semibold whitespace-nowrap text-brand-700"
                  >{{ tag }}</span>
                </div>
              </div>
              <div class="pr-3">
                <p class="text-xs text-ink-700">{{ formatDate(article.publishedAt) }}</p>
                <h2 class="mt-1 mb-2 text-[17px] tracking-[-0.01em] [line-height:1.3]">
                  <NuxtLink :to="`/kennisbank/${article.slug}`">{{ article.title }}</NuxtLink>
                </h2>
                <p class="text-[12.5px] leading-[1.55] text-ink-700">{{ article.excerpt }}</p>
                <div class="mt-[22px] flex items-center gap-2.5">
                  <span class="h-8 w-8 flex-none rounded-btn bg-line-300" aria-hidden="true" />
                  <span class="text-[13px] font-bold">{{ article.author }}</span>
                </div>
              </div>
            </article>

            <article v-else class="flex flex-col rounded-card border border-line-200 bg-white p-3.5">
              <div class="relative">
                <img
                  v-if="article.coverImage"
                  :src="article.coverImage"
                  :alt="`Cover: ${article.title}`"
                  class="block aspect-[2.45] w-full rounded-panel object-cover"
                >
                <ArticleCoverPlaceholder v-else aspect="2.45" class="rounded-panel" />
                <div class="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-2">
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="rounded-btn border border-brand-500 px-2.5 py-[5px] text-xs font-semibold whitespace-nowrap text-brand-700"
                  >{{ tag }}</span>
                </div>
              </div>
              <p class="mt-3.5 text-xs text-ink-700">{{ formatDate(article.publishedAt) }}</p>
              <h2 class="mt-1 mb-2 text-[17px] tracking-[-0.01em] [line-height:1.3]">
                <NuxtLink :to="`/kennisbank/${article.slug}`">{{ article.title }}</NuxtLink>
              </h2>
              <p class="text-[12.5px] leading-[1.55] text-ink-700">{{ article.excerpt }}</p>
              <div class="mt-auto flex items-center gap-2.5 pt-[18px]">
                <span class="h-8 w-8 flex-none rounded-btn bg-line-300" aria-hidden="true" />
                <span class="text-[13px] font-bold">{{ article.author }}</span>
              </div>
            </article>
          </template>
        </div>

        <p v-if="visibleArticles.length === 0" class="mt-10 text-ink-700">
          Nog geen artikelen met dit label.
        </p>
      </div>
    </section>

    <section class="bg-white px-[clamp(16px,4vw,24px)] pb-[clamp(56px,7vw,88px)]">
      <div class="mx-auto max-w-[1180px]">
        <FeatureGrid />
      </div>
    </section>

    <FaqSection />
  </div>
</template>
