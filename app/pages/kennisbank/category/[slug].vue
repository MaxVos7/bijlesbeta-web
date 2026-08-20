<script setup lang="ts">
import { articlesInCategory, findCategory, kennisbankCategories } from '~/data/kennisbank'

/**
 * A kennisbank category archive, at the same URL WordPress served —
 * `/kennisbank/category/<slug>/`.
 *
 * All seven of bijlesbeta.nl's archives are indexed and were 404ing here,
 * which would have thrown away seven ranking URLs and every internal link into
 * the articles beneath them. The layout follows the overview page rather than
 * the live archive template, which is Elementor's stock post grid.
 *
 * An article's `tags` are its categories, so nothing is filed twice.
 */
const route = useRoute()
const slug = computed(() => String(route.params.slug))
const category = computed(() => findCategory(slug.value))

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Categorie niet gevonden', fatal: true })
}

const posts = computed(() => articlesInCategory(slug.value))

// The live archive titles are just the category name, e.g. "Wiskunde A".
useSeo({
  title: () => category.value?.name ?? 'Kennisbank',
  description: () =>
    `Alle artikelen over ${category.value?.name.toLowerCase()} uit de kennisbank van Bijles Bèta, uitgelegd door onze eigen docenten.`,
})

/** The other archives, so each page links onward rather than dead-ending. */
const others = computed(() => kennisbankCategories.filter((c) => c.slug !== slug.value))
</script>

<template>
  <div v-if="category">
    <section class="px-[clamp(16px,4vw,40px)] pt-[30px] pb-12">
      <div class="mx-auto max-w-[1400px] p-9">
        <p class="kicker mb-2 text-[19px] leading-[19px]">
          <NuxtLink to="/kennisbank">Kennisbank</NuxtLink>
        </p>
        <h1 class="text-[26px] leading-[44px] md:text-[32px]">{{ category.name }}</h1>
        <p class="mt-4 text-[16px] leading-6 text-ink-muted md:max-w-[50%]">
          Alle artikelen over {{ category.name.toLowerCase() }}, uitgelegd door onze eigen docenten
          aan de hand van een voorbeeldvraag.
        </p>
      </div>
    </section>

    <section class="bg-white px-[clamp(16px,4vw,40px)] pt-20 pb-24">
      <div class="mx-auto max-w-[1400px] px-9 max-md:px-0">
        <div class="grid gap-6 md:grid-cols-2 desk:grid-cols-3">
          <ArticleCard v-for="article in posts" :key="article.slug" :article="article" stretch />
        </div>

        <p v-if="posts.length === 0" class="text-ink-muted">
          Nog geen artikelen in deze categorie.
        </p>

        <!-- Every archive links to the others: these pages exist to be crawled
             into, so none of them should be a dead end. -->
        <div class="mt-12 flex flex-wrap gap-x-5 gap-y-4">
          <NuxtLink
            v-for="other in others"
            :key="other.slug"
            :to="`/kennisbank/category/${other.slug}`"
            class="rounded-btn bg-parchment px-5 py-3.5 font-display text-[15px] leading-none font-bold text-ink-900 transition hover:bg-brand-500"
          >
            {{ other.name }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <TrialCta />
  </div>
</template>
