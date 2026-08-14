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
    <!--
      The hero sits on the page's own parchment, not on a ground of its own,
      and its photograph runs 700px tall from the very top of the band — past
      the bottom of the band and through the two spacer strips below it. That
      overlap is why the section is `relative z-10`: the white bands come
      later in the document and would otherwise paint over the picture.
    -->
    <section class="relative z-10 px-[clamp(16px,4vw,40px)]">
      <div
        class="mx-auto grid max-w-[1100px] gap-x-[100px] gap-y-8 max-desk:grid-cols-1 desk:grid-cols-2"
      >
        <div class="min-w-0 pt-[52px] pb-[92px]">
          <RatingLine class="mb-[18px]" />

          <h1 class="mb-[18px] text-[32px] leading-[44px] tracking-[-0.03em]">Tarieven</h1>
          <!-- Two paragraphs, as on the live page — not one with a <br>. -->
          <p class="text-base leading-6 text-ink-700">
            Wij zijn een lokaal initiatief, georganiseerd door studenten. Hierdoor kunnen we onze
            tarieven laag houden.
          </p>
          <p class="mb-7 text-base leading-6 text-ink-700">
            Onze pakketten zijn gericht op consistente begeleiding, zodat je het vak écht onder de
            knie krijgt.
          </p>

          <CheckList :items="heroPromises" class="mb-8" />

          <a href="#pakketten" class="btn-primary btn-lg">
            Tarieven bekijken <BtnArrow />
          </a>
          <p class="mt-3.5 text-[13px] text-ink-700">{{ reassurance }}</p>
        </div>

        <div class="relative min-w-0">
          <img
            src="/img/fiets.png"
            alt="Docent op de fiets in Groningen"
            class="block w-full rounded-panel object-cover max-desk:aspect-[5/7] desk:absolute desk:inset-x-0 desk:top-0 desk:h-[700px]"
          >
        </div>
      </div>
    </section>

    <!-- The live rhythm between bands: an 80px strip on the page ground, then
         an 80px strip already in the next band's white. -->
    <div class="h-20" />
    <div class="h-20 bg-white" />

    <section id="pakketten" class="bg-white px-[clamp(16px,4vw,40px)]">
      <PricingSection />
    </section>

    <div class="h-20 bg-white" />

    <section id="zo-werkt-het" class="bg-white px-[clamp(16px,4vw,40px)]">
      <div
        class="mx-auto grid max-w-[1400px] items-stretch gap-[72px] max-desk:grid-cols-1 desk:grid-cols-2"
      >
        <div
          class="min-h-[333px] w-full min-w-0 rounded-block bg-cover bg-center max-desk:aspect-[665/377]"
          style="background-image: url('/img/bord.png')"
          role="img"
          aria-label="Docent schrijft natuurkundeformules op een schoolbord"
        />
        <div class="min-w-0">
          <h2 class="mb-[22px] text-[32px] leading-[44px] tracking-[-0.025em]">Zo werkt het</h2>
          <CheckList :items="pricingNotes" class="mb-[30px]" />
          <NuxtLink to="/contact" class="btn-primary btn-lg">
            Neem contact op <BtnArrow />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- No spacer here or before the trial block: `StatsBand` carries the
         live 80px on both of its own edges. -->
    <StatsBand />

    <TrialCta />

    <FaqSection />
  </div>
</template>
