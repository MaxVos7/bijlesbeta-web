<script setup lang="ts">
import { pricingAssurances, pricingIntro, pricingPlans } from '~/data/site'

/**
 * The four packages with their heading and the assurance row underneath,
 * shared by /tarieven and the subject landing pages.
 *
 * Renders no <section> of its own: the two pages sit it on different grounds
 * and with different vertical rhythm (tarieven's hero photo overlaps it).
 */

const formatPrice = (value: number) =>
  value % 1 === 0 ? `€${value}` : `€${value.toFixed(2).replace('.', ',')}`
</script>

<template>
  <div>
    <div class="mb-[clamp(30px,4vw,48px)] text-center">
      <p class="kicker mb-2.5">{{ pricingIntro.kicker }}</p>
      <h2 class="mb-3.5 text-[clamp(24px,2.9vw,28px)] tracking-[-0.025em]">
        {{ pricingIntro.title }}
      </h2>
      <p class="mx-auto max-w-[62ch] text-[15px] leading-[1.7] text-ink-700">
        {{ pricingIntro.body }}
      </p>
    </div>

    <div
      class="grid items-stretch gap-[clamp(14px,1.6vw,20px)] [grid-template-columns:repeat(auto-fit,minmax(205px,1fr))]"
    >
      <div
        v-for="plan in pricingPlans"
        :key="plan.slug"
        class="flex flex-col rounded-card border px-6 pt-[26px] pb-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgb(31_29_28_/_0.13)]"
        :class="[
          plan.inverted ? 'border-ink-900 bg-ink-900 text-white' : 'border-line-200 text-ink-800',
          // The highlighted package is marked by its ground and a heavier
          // amber rule along the bottom, not by a coloured border or a glow.
          plan.featured ? 'border-b-4 border-b-brand-500 bg-parchment' : !plan.inverted && 'bg-white',
        ]"
      >
        <span
          class="mb-[18px] self-start rounded-btn border border-accent-500 px-[11px] py-[5px] text-[15px] font-semibold whitespace-nowrap text-accent-500"
        >
          {{ plan.hoursLabel }}
        </span>

        <h3 class="mb-2.5 text-[21px] tracking-[-0.02em]" :class="plan.inverted && 'text-white'">
          {{ plan.name }}
        </h3>
        <p
          class="mb-[22px] text-base leading-[1.75]"
          :class="plan.inverted ? 'text-ink-300' : 'text-ink-850'"
        >
          {{ plan.blurb }}
        </p>

        <div class="mt-auto">
          <p
            v-if="plan.savingsLabel"
            class="text-sm line-through"
            :class="plan.inverted ? 'text-ink-300' : 'text-ink-600'"
          >
            {{ formatPrice(plan.regularPrice) }}
          </p>
          <p class="mt-0.5 mb-1.5 flex items-baseline gap-2">
            <span class="text-[26px] font-bold tracking-[-0.03em]">{{ formatPrice(plan.price) }}</span>
            <span class="text-sm" :class="plan.inverted ? 'text-ink-300' : 'text-ink-600'">/uur</span>
          </p>
          <span
            v-if="plan.savingsLabel"
            class="inline-block rounded-md bg-success-50 px-[9px] py-1 text-[11.5px] font-semibold text-success-900"
          >
            {{ plan.savingsLabel }}
          </span>
        </div>

        <ul class="mt-6 mb-[26px] flex list-none flex-col gap-[11px] p-0">
          <li
            v-for="feature in plan.features"
            :key="feature"
            class="flex items-start gap-[11px] text-[13.5px] leading-snug"
          >
            <svg
              class="mt-0.5 h-[15px] w-[15px] flex-none text-success-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M4 12l6 6L20 6" />
            </svg>
            {{ feature }}
          </li>
        </ul>

        <NuxtLink to="/aanmelden" class="btn-primary w-full justify-between gap-3.5 px-5 py-[13px]">
          Gratis proefles <span aria-hidden="true">→</span>
        </NuxtLink>
        <p class="mt-3.5 text-[11.5px]" :class="plan.inverted ? 'text-ink-300' : 'text-ink-600'">
          <strong :class="plan.inverted ? 'text-white' : 'text-ink-800'">100% gratis</strong>,
          je zit nergens aan vast
        </p>
      </div>
    </div>

    <div
      class="mt-[clamp(30px,4vw,46px)] flex flex-wrap justify-center gap-x-[clamp(20px,3vw,36px)] gap-y-3.5 text-sm"
    >
      <span v-for="item in pricingAssurances" :key="item" class="flex items-center gap-2.5">
        <svg
          class="h-[15px] w-[15px] text-success-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12l6 6L20 6" />
        </svg>
        {{ item }}
      </span>
    </div>
  </div>
</template>
