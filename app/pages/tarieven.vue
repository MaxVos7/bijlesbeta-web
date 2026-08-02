<script setup lang="ts">
import {
  heroPromises,
  pricingAssurances,
  pricingNotes,
  pricingPlans,
  reassurance,
} from '~/data/site'

useSeoMeta({
  title: 'Tarieven',
  description:
    'Bijles vanaf €25 per uur. Geen servicekosten, een gratis proefles en maandelijkse facturatie achteraf.',
})

const formatPrice = (value: number) =>
  value % 1 === 0 ? `€${value}` : `€${value.toFixed(2).replace('.', ',')}`
</script>

<template>
  <div>
    <section class="bg-cream px-[clamp(16px,4vw,24px)] pt-[clamp(24px,4vw,44px)]">
      <div
        class="mx-auto grid max-w-[1180px] items-end gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      >
        <div class="min-w-0 pb-[clamp(40px,6vw,80px)]">
          <RatingLine class="mb-[18px]" />

          <h1 class="mb-[18px] text-[clamp(32px,4.4vw,50px)] leading-[1.1] tracking-[-0.03em]">
            Tarieven
          </h1>
          <p class="mb-7 max-w-[46ch] text-[clamp(15px,1.2vw,17px)] leading-relaxed text-ink-600">
            Wij zijn een lokaal initiatief, georganiseerd door studenten. Hierdoor kunnen we onze
            tarieven laag houden. Onze pakketten zijn gericht op consistente begeleiding, zodat je
            het vak écht onder de knie krijgt.
          </p>

          <CheckList :items="heroPromises" class="mb-8" />

          <a
            href="#pakketten"
            class="btn-primary gap-3.5 rounded-panel px-[26px] py-4 text-base shadow-[0_6px_18px_rgb(245_179_1_/_0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgb(245_179_1_/_0.42)]"
          >
            Tarieven bekijken <span class="text-lg" aria-hidden="true">→</span>
          </a>
          <p class="mt-3.5 text-[13px] text-ink-400">{{ reassurance }}</p>
        </div>

        <div class="mb-[clamp(-80px,-5vw,-40px)] min-w-0">
          <img
            src="/img/fiets.png"
            alt="Docent op de fiets in Groningen"
            class="mx-auto block aspect-[3/4] w-full max-w-[420px] rounded object-cover"
          >
        </div>
      </div>
    </section>

    <section
      id="pakketten"
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(88px,10vw,130px)] pb-[clamp(40px,5vw,60px)]"
    >
      <div class="mx-auto max-w-[1180px]">
        <div class="mb-[clamp(30px,4vw,48px)] text-center">
          <p class="kicker mb-2.5">Tarieven en pakketten</p>
          <h2 class="mb-3.5 text-[clamp(24px,2.9vw,33px)] tracking-[-0.025em]">Eerlijk geprijsd</h2>
          <p class="mx-auto max-w-[62ch] text-[15px] leading-[1.7] text-ink-700">
            Met pakketten stimuleren we consistente bijles waardoor jij het vak echt leert begrijpen.
            Het uurtarief is afhankelijk van het gekozen pakket.
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
              plan.inverted ? 'border-ink-900 bg-ink-900 text-white' : 'bg-white text-ink-900',
              plan.featured
                ? 'border-brand-500 shadow-[0_10px_26px_rgb(245_179_1_/_0.18)]'
                : !plan.inverted && 'border-line-200',
            ]"
          >
            <span
              class="mb-[18px] self-start rounded-[7px] border border-accent-500 px-[11px] py-[5px] text-[12.5px] font-semibold whitespace-nowrap"
            >
              {{ plan.hoursLabel }}
            </span>

            <h3 class="mb-2.5 text-[21px] tracking-[-0.02em]" :class="plan.inverted && 'text-white'">
              {{ plan.name }}
            </h3>
            <p
              class="mb-[22px] text-sm leading-relaxed"
              :class="plan.inverted ? 'text-ink-300' : 'text-ink-600'"
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
              <strong :class="plan.inverted ? 'text-white' : 'text-ink-900'">100% gratis</strong>,
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
    </section>

    <section class="bg-white px-[clamp(16px,4vw,24px)] py-[clamp(40px,6vw,80px)]">
      <div
        class="mx-auto grid max-w-[1080px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
      >
        <img
          src="/img/persoonlijk.png"
          alt="Docent legt de stof uit"
          class="block aspect-[4/3] w-full min-w-0 rounded-tile object-cover"
          loading="lazy"
        >
        <div class="min-w-0">
          <h2 class="mb-[22px] text-[clamp(23px,2.6vw,30px)] tracking-[-0.025em]">Zo werkt het</h2>
          <ul class="mb-[30px] flex list-none flex-col gap-3.5 p-0">
            <li
              v-for="note in pricingNotes"
              :key="note"
              class="flex items-start gap-3 text-sm leading-relaxed text-ink-700"
            >
              <svg
                class="mt-1 h-[15px] w-[15px] flex-none text-success-500"
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
              {{ note }}
            </li>
          </ul>
          <NuxtLink to="/contact" class="btn-primary gap-3.5 rounded-[11px] px-[22px] py-3.5 text-[15px]">
            Neem contact op <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <StatsBand />

    <TrialCta />

    <FaqSection />
  </div>
</template>
