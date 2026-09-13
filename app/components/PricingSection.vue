<script setup lang="ts">
import { looseLesson, pricingAssurances, pricingIntro, pricingPlans } from '~/data/site'

/**
 * The three packages with their heading, the Losse lessen line and the
 * assurance row underneath, shared by /tarieven and the subject landing
 * pages.
 *
 * Renders no <section> of its own: the two pages sit it on different grounds
 * and with different vertical rhythm (tarieven's hero photo overlaps it). It
 * does set its own width, though — see the comment on the grid below.
 *
 * Everything inside the card is measured off the live packages rather than
 * designed. The numbers that look arbitrary are theirs: 24px padding, a
 * 22px/22px title, a 19px price against a 13px strike, and a savings pill in
 * the mint green over the same green at 10%.
 */

const formatPrice = (value: number) =>
  value % 1 === 0 ? `€${value}` : `€${value.toFixed(2).replace('.', ',')}`
</script>

<template>
  <div>
    <div class="mx-auto mb-[clamp(30px,4vw,48px)] max-w-[1368px] text-center">
      <p class="kicker mb-3 text-[19px]">{{ pricingIntro.kicker }}</p>
      <h2 class="mb-3 text-[clamp(24px,2.9vw,28px)] leading-[44px] tracking-[-0.025em]">
        {{ pricingIntro.title }}
      </h2>
      <p class="mx-auto max-w-[800px] text-base leading-[28px] text-ink-800">
        {{ pricingIntro.body }}
      </p>
    </div>

    <!--
      Narrowed from the live site's 1368px: the Claude Design handoff cut
      Losse lessen from a fourth card to the quiet line below, and dropped
      this to 1026px so the three remaining cards keep their original
      ~326px width instead of stretching to fill the wider band.
    -->
    <div
      class="mx-auto grid max-w-[1026px] items-stretch gap-3 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]"
    >
      <div
        v-for="plan in pricingPlans"
        :key="plan.slug"
        class="flex flex-col rounded-card border border-line-ink p-6 text-ink-800"
        :class="[
          // The highlighted package is marked by its ground and an 8px amber
          // bar along the bottom, not by a coloured border or a glow. The
          // live site draws that bar as a child element; a bottom border of
          // the same weight lands in exactly the same place.
          plan.featured ? 'border-b-8 border-b-brand-500 bg-parchment' : 'bg-white',
        ]"
      >
        <span
          class="mb-[18px] self-start rounded-btn border border-accent-500 px-3 py-1 text-[15px] leading-[21px] font-semibold whitespace-nowrap text-accent-500"
        >
          {{ plan.hoursLabel }}
        </span>

        <h3 class="mb-2.5 text-[22px] leading-[22px] tracking-[-0.02em]">
          {{ plan.name }}
        </h3>
        <p class="mb-[22px] text-base leading-[28px] text-ink-850">
          {{ plan.blurb }}
        </p>

        <div class="mt-auto">
          <p v-if="plan.savingsLabel" class="text-[13px] leading-[19.5px] text-ink-800 line-through">
            {{ formatPrice(plan.regularPrice) }}
          </p>
          <p class="mb-1.5 flex items-baseline gap-2">
            <span class="text-[19px] leading-[28.5px] font-bold text-ink-800">{{ formatPrice(plan.price) }}</span>
            <span class="text-[13px] text-ink-800">/uur</span>
          </p>
          <span
            v-if="plan.savingsLabel"
            class="inline-block rounded-btn bg-mint/10 px-[5px] py-px text-[11px] leading-[16.5px] text-mint"
          >
            {{ plan.savingsLabel }}
          </span>
        </div>

        <ul class="mt-6 mb-[26px] flex list-none flex-col p-0">
          <li
            v-for="feature in plan.features"
            :key="feature"
            class="flex items-start gap-3.5 pb-[5px] text-[15px] leading-[22.5px] font-semibold text-ink-800"
          >
            <svg
              class="mt-[4px] h-3.5 w-3.5 flex-none text-success-500"
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
            <span class="pl-[5px]">{{ feature }}</span>
          </li>
        </ul>

        <!-- Content-width, not full-bleed: the live CTA is an inline-block
             that ends short of the card's inner edge. -->
        <NuxtLink to="/aanmelden" class="btn-primary btn-lg self-start">
          Gratis proefles <BtnArrow />
        </NuxtLink>
        <CtaNote class="mt-3.5" />
      </div>
    </div>

    <!--
      The line that replaced Losse lessen's card: same border and radius as
      the packages above it, price and CTA on the right, no button — added
      here rather than as a fourth `pricingPlans` entry so it can't rejoin
      the grid by accident.
    -->
    <div class="mx-auto mt-[clamp(28px,3.5vw,40px)] max-w-[1026px]">
      <div
        class="flex flex-wrap items-center justify-between gap-5 rounded-card border border-line-ink bg-white px-6 py-5"
      >
        <div class="min-w-0">
          <h3 class="text-[17px] leading-[26px] tracking-[-0.02em]">{{ looseLesson.name }}</h3>
          <p class="text-sm leading-[22px] text-ink-700">{{ looseLesson.blurb }}</p>
        </div>
        <div class="flex items-center gap-5">
          <p class="flex items-baseline gap-1.5">
            <span class="text-[19px] leading-[28.5px] font-bold text-ink-800">{{ formatPrice(looseLesson.price) }}</span>
            <span class="text-[13px] text-ink-700">/uur</span>
          </p>
          <NuxtLink
            to="/aanmelden"
            class="inline-flex items-center gap-2 border-b-[1.5px] border-ink-900/25 font-display text-sm font-bold text-ink-800"
          >
            {{ looseLesson.cta }}
            <svg class="h-3 w-[13px] flex-none" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
              <path
                d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div
      class="mt-[clamp(30px,4vw,46px)] flex flex-wrap justify-center gap-x-[clamp(20px,3vw,36px)] gap-y-3.5 text-[15px] leading-[22.5px] font-semibold text-ink-800"
    >
      <span v-for="item in pricingAssurances" :key="item" class="flex items-center gap-2.5">
        <svg
          class="h-3.5 w-3.5 flex-none text-success-500"
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
