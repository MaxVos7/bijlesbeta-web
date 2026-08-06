<script setup lang="ts">
import { heroPromises, pricingNotes, reassurance } from '~/data/site'

useSeoMeta({
  title: 'Tarieven',
  description:
    'Bijles vanaf €25 per uur. Geen servicekosten, een gratis proefles en maandelijkse facturatie achteraf.',
})
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
            tarieven laag houden.<br>
            Onze pakketten zijn gericht op consistente begeleiding, zodat je het vak écht onder de
            knie krijgt.
          </p>

          <CheckList :items="heroPromises" class="mb-8" />

          <a
            href="#pakketten"
            class="btn-primary gap-3.5 px-6 py-5 text-[15px] shadow-[0_6px_18px_rgb(255_187_0_/_0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgb(255_187_0_/_0.42)]"
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
        <PricingSection />
      </div>
    </section>

    <section id="zo-werkt-het" class="bg-white px-[clamp(16px,4vw,24px)] py-[clamp(40px,6vw,80px)]">
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
          <NuxtLink to="/contact" class="btn-primary gap-3.5 px-[22px] py-3.5 text-[15px]">
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
