<script setup lang="ts">
/**
 * One kennisbank article as a card — the overview grid, and the "Lees ook
 * eens…" row under an article.
 *
 * Measured against the live loop templates rather than designed. The card is
 * white on the 12px block radius with the site's `line-ink` hairline, 12px of
 * padding, a 176px cover crop on the 4px control radius, and its copy inset a
 * further 12px so the picture sits flush to the card's own padding while the
 * text does not.
 *
 * `variant="wide"` is the tile that spans two columns as the grid's fifth
 * item: parchment instead of white, the cover turned on its side to fill the
 * card's full height, and the copy centred against it. Its type is the one
 * thing here taken off a screenshot rather than off the Elementor CSS — the
 * live wide template's stylesheet isn't published on its own — so the 15px /
 * 22px step is a measurement of the rendered page, ±1px. Re-check it before
 * treating those two numbers as settled.
 */
import { categorySlug, type Article } from '~/data/kennisbank'

const props = withDefaults(
  defineProps<{
    article: Article
    variant?: 'standard' | 'wide'
    /** Fill the grid row's height — the related-articles grid stretches, the overview grid doesn't. */
    stretch?: boolean
  }>(),
  { variant: 'standard', stretch: false },
)

const wide = computed(() => props.variant === 'wide')
const coverFailed = ref(false)

const dateFormatter = new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long' })
const publishedOn = computed(() => dateFormatter.format(new Date(props.article.publishedAt)))
</script>

<template>
  <article
    class="rounded-block px-3"
    :class="[
      wide ? 'bg-parchment md:col-span-2' : 'border border-line-ink bg-white',
      stretch ? 'h-full' : '',
    ]"
  >
    <div
      class="h-full py-3"
      :class="wide ? 'grid gap-3 md:grid-cols-2 md:items-center' : 'flex flex-col gap-4'"
    >
      <!-- Cover. The tag pills sit over its top-left corner on both variants. -->
      <div class="relative" :class="wide ? 'h-full min-h-[260px]' : ''">
        <img
          v-if="article.coverImage && !coverFailed"
          :src="article.coverImage"
          :alt="`Cover: ${article.title}`"
          class="block w-full rounded-btn object-cover"
          :class="wide ? 'h-full' : 'h-44'"
          loading="lazy"
          @error="coverFailed = true"
        >
        <ArticleCoverPlaceholder
          v-else
          :aspect="wide ? '0.7' : '1.72'"
          class="h-full rounded-btn"
        />

        <!-- The pills are the live site's `category-button`: amber label on an
             amber hairline with no fill of its own, so the photograph reads
             straight through them. That is parity, not an oversight — the same
             call as the kicker's amber-on-cream. They link to the category
             archive, which exists at the same URL WordPress served. -->
        <div class="absolute top-2 left-3 flex flex-wrap gap-2">
          <NuxtLink
            v-for="tag in article.tags"
            :key="tag"
            :to="`/kennisbank/category/${categorySlug(tag)}`"
            class="rounded-btn border border-brand-500 px-3 py-1.5 font-display text-[15px] leading-[21px] font-semibold whitespace-nowrap text-brand-500"
          >{{ tag }}</NuxtLink>
        </div>
      </div>

      <div class="flex flex-col gap-2 px-3 pb-3" :class="wide ? 'md:pb-0' : ''">
        <p :class="wide ? 'text-[15px] leading-[22px] text-ink-muted' : 'text-[13px] leading-[19.5px] text-ink-muted'">
          {{ publishedOn }}
        </p>
        <h3 :class="wide ? 'text-[22px] leading-[28px] font-bold' : 'text-[19px] leading-5 font-bold'">
          <NuxtLink :to="`/kennisbank/${article.slug}`">{{ article.title }}</NuxtLink>
        </h3>
        <p :class="wide ? 'text-[15px] leading-[22px] text-ink-muted' : 'text-[13px] leading-[19.5px] text-ink-muted'">
          {{ article.excerpt }}
        </p>
        <AuthorBadge :name="article.author" />
      </div>
    </div>
  </article>
</template>
