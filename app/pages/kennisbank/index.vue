<script setup lang="ts">
import { articles, filterTags, type Article } from '~/data/kennisbank'

/**
 * Measured against bijlesbeta.nl's `post-204.css` rather than designed, so a
 * few things here are the live page's and shouldn't be tidied:
 *
 * - **The hero sits on the page's own parchment**, not on a ground of its
 *   own, and the white band starts below it. `PageHero` paints `cream` with a
 *   rule under it, so this page writes its hero out rather than mounting it.
 * - **Two nested gutters.** The band takes the sitewide 40px, and the filter
 *   and grid take a further 36px inside it — which collapses to 0 below
 *   768px, exactly as the live container does.
 * - **The grid steps on Elementor's breakpoints**: three columns from 1025px
 *   (`desk:`), two from 768px, one below. Cards are *not* stretched to a
 *   common row height here — the live overview grid lets them end where their
 *   copy ends, unlike the related-articles grid on an article page.
 */
useSeo({
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

// The wide two-up tile only reads well as the unfiltered grid's fifth item —
// which is where the live loop grid places it too. Once a chip narrows the
// set, every card falls back to the normal layout.
function isFeatured(article: Article) {
  return activeTag.value === 'Alle artikelen' && article.slug === 'rekenen-met-procenten'
}
</script>

<template>
  <div>
    <section class="px-[clamp(16px,4vw,40px)] pt-[30px] pb-12">
      <div class="mx-auto max-w-[1400px] p-9">
        <h1 class="text-[26px] leading-[44px] md:text-[32px]">Onze kennisbank</h1>
        <p class="mt-4 text-[16px] leading-6 text-ink-muted md:max-w-[50%]">
          Op onze kennisbank leggen onze eigen docenten onderwerpen uit aan de hand van een
          voorbeeldvraag en een duidelijke uitleg.
        </p>
      </div>
    </section>

    <section class="bg-white px-[clamp(16px,4vw,40px)] pt-20 pb-24">
      <div class="mx-auto max-w-[1400px] px-9 max-md:px-0">
        <div class="flex flex-wrap gap-x-5 gap-y-6" role="group" aria-label="Filter op categorie">
          <!-- 15px/700 on a flat leading with 14/20 padding — the live filter
               item is 43px tall because the label's own line box sets the
               height, the same trick `btn` plays. -->
          <button
            v-for="chip in chips"
            :key="chip"
            type="button"
            class="rounded-btn px-5 py-3.5 font-display text-[15px] leading-none font-bold text-ink-900 transition"
            :class="activeTag === chip ? 'bg-brand-500' : 'bg-parchment hover:bg-brand-500'"
            :aria-pressed="activeTag === chip"
            @click="activeTag = chip"
          >
            {{ chip }}
          </button>
        </div>

        <div class="mt-8 grid gap-6 md:grid-cols-2 desk:grid-cols-3">
          <ArticleCard
            v-for="article in visibleArticles"
            :key="article.slug"
            :article="article"
            :variant="isFeatured(article) ? 'wide' : 'standard'"
          />
        </div>

        <p v-if="visibleArticles.length === 0" class="mt-10 text-ink-muted">
          Nog geen artikelen met dit label.
        </p>
      </div>
    </section>

    <!-- The feature band is a shared Elementor template (`45ff7e9f`), and it
         declares no width of its own on any page that mounts it, so it takes
         the kit's 1400px like the two bands above it. -->
    <section class="px-[clamp(16px,4vw,40px)] py-12">
      <div class="mx-auto max-w-[1400px]">
        <FeatureGrid />
      </div>
    </section>

    <FaqSection />
  </div>
</template>
