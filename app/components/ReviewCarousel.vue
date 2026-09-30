<script setup lang="ts">
import { reviews } from '~/data/site'

/**
 * Three reviews at a time, wrapping in both directions. Below 768px it shows
 * one, with the arrows and a row of dots underneath it and a swipe to step.
 */
withDefaults(
  defineProps<{
    /** The cards' own ground: white on a sand band, sand on a white one. */
    cardGround?: 'white' | 'sand'
  }>(),
  { cardGround: 'white' },
)

const start = ref(2)
const visible = computed(() =>
  [0, 1, 2].map((offset) => reviews[(start.value + offset) % reviews.length]!),
)

function step(direction: number) {
  start.value = (start.value + direction + reviews.length) % reviews.length
}

/* A horizontal swipe of 40px or more steps once; anything shorter, or more
   vertical than horizontal, is a scroll and is left alone. */
let touchX = 0
let touchY = 0
function onTouchStart(event: TouchEvent) {
  touchX = event.touches[0]?.clientX ?? 0
  touchY = event.touches[0]?.clientY ?? 0
}
function onTouchEnd(event: TouchEvent) {
  const dx = (event.changedTouches[0]?.clientX ?? 0) - touchX
  const dy = (event.changedTouches[0]?.clientY ?? 0) - touchY
  if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1)
}
</script>

<template>
  <!-- On a phone the card takes the full row and the controls wrap beneath
       it; from 768px up the arrows sit either side of the three cards. -->
  <div class="flex flex-wrap items-center justify-center gap-x-[clamp(10px,1.8vw,22px)] gap-y-5 md:flex-nowrap">
    <button
      type="button"
      class="order-2 h-11 w-11 md:order-none flex-none rounded-btn border border-line-300 bg-white text-base transition hover:border-brand-500 hover:bg-linen"
      aria-label="Vorige review"
      @click="step(-1)"
    >←</button>

    <!-- min-w-0 lets the grid shrink below its 240px track inside the flex row;
         without it the three columns overflow the viewport on a phone. -->
    <div
      class="order-1 grid w-full max-w-[900px] min-w-0 basis-full gap-[clamp(14px,1.8vw,22px)] md:order-none md:flex-1 md:basis-auto md:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]"
      aria-live="polite"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
    >
      <figure
        v-for="(review, index) in visible"
        :key="review.author"
        class="flex min-h-[320px] flex-col rounded-tile p-6"
        :class="[cardGround === 'sand' ? 'bg-sand' : 'bg-white', index > 0 && 'max-md:hidden']"
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

        <h3 class="mb-2 text-[14.5px] leading-snug">{{ review.title }}</h3>
        <blockquote class="mb-auto text-[13.5px] leading-[1.68] whitespace-pre-line text-ink-700">
          {{ review.body }}
        </blockquote>

        <!-- No rule above the name: the space alone separates it from the quote. -->
        <figcaption class="mt-6 pt-4">
          <span class="block text-[13.5px] font-bold">{{ review.author }}</span>
          <span class="block text-[12.5px] text-ink-600">{{ review.affiliation }}</span>
        </figcaption>
      </figure>
    </div>

    <!-- Where the phone is in the list; the desktop row needs no counter. -->
    <div class="order-3 flex items-center gap-2 md:hidden" aria-hidden="true">
      <span
        v-for="(review, index) in reviews"
        :key="review.author"
        class="h-2 w-2 rounded-full transition"
        :class="index === start ? 'bg-brand-500' : 'bg-ink-900/15'"
      />
    </div>

    <button
      type="button"
      class="order-4 h-11 w-11 flex-none rounded-btn border border-line-300 bg-white text-base transition hover:border-brand-500 hover:bg-linen md:order-none"
      aria-label="Volgende review"
      @click="step(1)"
    >→</button>
  </div>
</template>
