<script setup lang="ts">
import { articles, findArticle } from '~/data/kennisbank'

const route = useRoute()
const article = findArticle(String(route.params.slug))

if (!article) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Artikel niet gevonden',
    fatal: true,
  })
}

useSeoMeta({
  title: article.title,
  description: article.excerpt,
})

const dateFormatter = new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long' })

const related = articles
  .filter((item) => item.slug !== article.slug && item.category === article.category)
  .slice(0, 2)
</script>

<template>
  <article v-if="article">
    <header class="border-b border-slate-200 bg-brand-50">
      <div class="container-page py-14">
        <NuxtLink
          to="/kennisbank"
          class="text-sm font-medium text-brand-700 hover:underline"
        >
          ← Terug naar de kennisbank
        </NuxtLink>
        <p class="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-600">
          {{ article.category }}
        </p>
        <h1 class="mt-2 max-w-3xl text-3xl sm:text-4xl">{{ article.title }}</h1>
        <p class="mt-4 text-sm text-slate-500">
          {{ dateFormatter.format(new Date(article.publishedAt)) }} ·
          {{ article.readingMinutes }} min lezen
        </p>
      </div>
    </header>

    <div class="container-page max-w-3xl py-14">
      <p class="text-lg leading-relaxed text-slate-700">{{ article.excerpt }}</p>

      <div class="mt-8">
        <template v-for="(block, index) in article.body" :key="index">
          <h2 v-if="block.type === 'heading'" class="mt-10 mb-3 text-xl">
            {{ block.text }}
          </h2>
          <p v-else-if="block.type === 'paragraph'" class="mb-4 leading-relaxed text-slate-600">
            {{ block.text }}
          </p>
          <ul v-else class="mb-4 space-y-2">
            <li
              v-for="item in block.items"
              :key="item"
              class="flex gap-3 leading-relaxed text-slate-600"
            >
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
              {{ item }}
            </li>
          </ul>
        </template>
      </div>

      <div class="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 class="text-lg">Loop je hier alleen niet uit?</h2>
        <p class="mt-2 leading-relaxed text-slate-600">
          Tijdens een gratis proefles kijken we samen waar het misgaat.
        </p>
        <NuxtLink to="/aanmelden" class="btn-primary mt-5">Plan een proefles</NuxtLink>
      </div>

      <section v-if="related.length" class="mt-14">
        <h2 class="text-xl">Meer over {{ article.category.toLowerCase() }}</h2>
        <ul class="mt-5 space-y-3">
          <li v-for="item in related" :key="item.slug">
            <NuxtLink
              :to="`/kennisbank/${item.slug}`"
              class="font-medium text-brand-700 hover:underline"
            >
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </article>
</template>
