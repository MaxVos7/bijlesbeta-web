<script setup lang="ts">
/**
 * Three reviews at a time, wrapping in both directions.
 *
 * The set is whatever `useReviews()` hands over: Google's own reviews when the
 * lookup is configured and answering, the transcribed ones from
 * `app/data/site.ts` otherwise. A Google review has no title and its subtitle
 * is Google's relative date ("3 maanden geleden") rather than a role, so both
 * lines render only when the review carries them.
 */
const { reviews, live } = useReviews()

/*
  Google's five come in its own relevance order, so the carousel opens on the
  first of them. The transcribed set opens at 2, which is where it opened
  before this was wired up and which is the trio the live site shows.
*/
const start = ref(live.value ? 0 : 2)

/** Three columns, or fewer when Google returned fewer than three reviews. */
const slots = computed(() => Math.min(3, reviews.value.length))

const visible = computed(() =>
  Array.from(
    { length: slots.value },
    (_, offset) => reviews.value[(start.value + offset) % reviews.value.length]!,
  ),
)

/** Nothing to turn when every review is already on screen. */
const canTurn = computed(() => reviews.value.length > slots.value)

function step(direction: number) {
  start.value = (start.value + direction + reviews.value.length) % reviews.value.length
}
</script>

<template>
  <div class="flex items-center justify-center gap-[clamp(10px,1.8vw,22px)]">
    <button
      v-if="canTurn"
      type="button"
      class="h-11 w-11 flex-none rounded-btn border border-line-300 bg-white text-base transition hover:border-brand-500 hover:bg-linen"
      aria-label="Vorige review"
      @click="step(-1)"
    >←</button>

    <!-- min-w-0 lets the grid shrink below its 240px track inside the flex row;
         without it the three columns overflow the viewport on a phone. -->
    <div
      class="grid w-full max-w-[900px] min-w-0 flex-1 gap-[clamp(14px,1.8vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]"
    >
      <figure
        v-for="review in visible"
        :key="review.id"
        class="flex min-h-[320px] flex-col rounded-tile bg-white p-6"
      >
        <svg class="mb-3 block h-[22px] w-[22px]" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#FFC107"
            d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36a12 12 0 110-24c3.1 0 5.8 1.2 8 3.1l5.7-5.7A20 20 0 1044 24c0-1.3-.1-2.6-.4-3.9z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8A12 12 0 0124 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7A20 20 0 006.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0124 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5A20 20 0 0024 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.1H42V20H24v8h11.3a12 12 0 01-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
          />
        </svg>

        <p class="mb-2.5">
          <span class="sr-only">{{ review.rating }} van de 5 sterren</span>
          <StarRating :value="review.rating" />
        </p>

        <h3 v-if="review.title" class="mb-2 text-[14.5px] leading-snug">{{ review.title }}</h3>
        <blockquote class="mb-auto text-[13.5px] leading-[1.68] whitespace-pre-line text-ink-700">
          {{ review.body }}
        </blockquote>

        <!-- No rule above the name: the space alone separates it from the quote.
             The name links to the reviewer's Google profile where there is one —
             attributing a review to its author is a condition of showing it,
             not a flourish. -->
        <figcaption class="mt-6 pt-4">
          <a
            v-if="review.authorUrl"
            :href="review.authorUrl"
            target="_blank"
            rel="noopener nofollow"
            class="block text-[13.5px] font-bold hover:text-brand-600"
          >{{ review.author }}</a>
          <span v-else class="block text-[13.5px] font-bold">{{ review.author }}</span>
          <span v-if="review.affiliation" class="block text-[12.5px] text-ink-600">
            {{ review.affiliation }}
          </span>
        </figcaption>
      </figure>
    </div>

    <button
      v-if="canTurn"
      type="button"
      class="h-11 w-11 flex-none rounded-btn border border-line-300 bg-white text-base transition hover:border-brand-500 hover:bg-linen"
      aria-label="Volgende review"
      @click="step(1)"
    >→</button>
  </div>
</template>
