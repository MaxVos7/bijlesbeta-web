<script setup lang="ts">
import { articles, categories } from '~/data/kennisbank'

useSeoMeta({
  title: 'Kennisbank',
  description:
    'Uitleg, studietips en stappenplannen voor wiskunde, natuurkunde en scheikunde, geschreven door onze docenten.',
})

const activeCategory = ref<string>('Alles')

const visibleArticles = computed(() =>
  activeCategory.value === 'Alles'
    ? articles
    : articles.filter((article) => article.category === activeCategory.value),
)

const dateFormatter = new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long' })
const formatDate = (value: string) => dateFormatter.format(new Date(value))
</script>

<template>
  <div>
    <PageHero
      eyebrow="Kennisbank"
      title="Uitleg en studietips van onze docenten"
      intro="Korte artikelen over de onderwerpen waar leerlingen het vaakst op vastlopen — en hoe je ze aanpakt."
    />

    <section class="section">
      <div class="container-page">
        <div class="flex flex-wrap gap-2" role="group" aria-label="Filter op categorie">
          <button
            v-for="category in ['Alles', ...categories]"
            :key="category"
            type="button"
            class="rounded-full border px-4 py-2 text-sm font-medium transition"
            :class="
              activeCategory === category
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-slate-300 text-slate-600 hover:border-brand-300'
            "
            :aria-pressed="activeCategory === category"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="article in visibleArticles"
            :key="article.slug"
            class="flex flex-col rounded-xl border border-slate-200 p-6 transition hover:border-brand-300 hover:shadow-sm"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {{ article.category }}
            </p>
            <h2 class="mt-2 text-lg">
              <NuxtLink :to="`/kennisbank/${article.slug}`" class="hover:text-brand-700">
                {{ article.title }}
              </NuxtLink>
            </h2>
            <p class="mt-2 flex-1 leading-relaxed text-slate-600">{{ article.excerpt }}</p>
            <p class="mt-4 text-xs text-slate-500">
              {{ formatDate(article.publishedAt) }} · {{ article.readingMinutes }} min lezen
            </p>
          </article>
        </div>

        <p v-if="visibleArticles.length === 0" class="mt-10 text-slate-600">
          Nog geen artikelen in deze categorie.
        </p>
      </div>
    </section>
  </div>
</template>
