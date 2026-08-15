<script setup lang="ts">
import { heroPromises, reassurance, zoWerktHet } from '~/data/site'

useSeo({
  title: 'Zo werkt het',
  // The live description here is the rating label ("Uitstekend") picked up by
  // Rank Math, not written copy, so ours is kept.
  description:
    'Van aanmelding tot de eerste bijles in vier stappen: meld je aan, wij zoeken de juiste docent, jullie leren elkaar kennen tijdens de gratis proefles en daarna gaan de bijlessen van start.',
})
</script>

<template>
  <div>
    <!--
      Measured against `post-42.css` rather than designed, like `/tarieven` and
      `/werken-bij`. The numbers below are the live page's:

      - The band has no ground of its own. It sits on the page's `parchment`;
        white only starts in the spacer strip below it.
      - 1100px content column on 40px gutters, split 50/50 on a 100px gap.
      - The copy column carries 52px of top and 92px of bottom padding (32/20
        below 768px), and its children are spaced on a flat 12px rhythm plus
        each widget's own margin — hence the odd-looking 16/24/36px steps.
      - The H1 holds 32px/44px at every width. Unlike the other pages, this one
        has no 767px step for it; don't add one.
      - The photograph is a flat 550px crop from the top, on the 8px surface
        radius rather than the 12px block one.
    -->
    <section class="px-[clamp(16px,4vw,40px)]">
      <div
        class="mx-auto grid max-w-[1100px] gap-x-[100px] gap-y-8 max-desk:grid-cols-1 desk:grid-cols-2"
      >
        <div class="min-w-0 pt-[52px] pb-[92px] max-md:pt-8 max-md:pb-5">
          <RatingLine class="mb-3" />

          <h1 class="mb-4 text-[32px] leading-[44px] tracking-[-0.03em]">
            {{ zoWerktHet.title }}
          </h1>
          <p class="mb-6 text-base leading-6 text-ink-700">{{ zoWerktHet.intro }}</p>

          <CheckList :items="heroPromises" class="mb-9" />

          <!-- `items-start` so the bordered second button doesn't stretch the
               first to its own 56px; the live pair is 54 and 56. -->
          <div class="mb-3 flex flex-wrap items-start gap-3">
            <NuxtLink to="/aanmelden" class="btn-primary btn-lg">
              Gratis proefles <BtnArrow />
            </NuxtLink>
            <!--
              Not `btn-secondary`: the live page's second button is the page
              ground with a black/20 hairline, the same treatment the hero CTA
              on `/werken-bij` takes.
            -->
            <a href="#stappenplan" class="btn btn-lg border border-black/20 bg-parchment hover:bg-cream">
              {{ zoWerktHet.secondaryCta }} <BtnArrow />
            </a>
          </div>
          <p class="text-[12px] text-ink-700">{{ reassurance }}</p>
        </div>

        <div class="min-w-0">
          <img
            src="/img/fiets.png"
            alt="Docent op de fiets in Groningen"
            class="block h-[550px] w-full rounded-panel object-cover object-top"
          >
        </div>
      </div>
    </section>

    <!-- The live rhythm between bands: an 80px strip on the page ground, then
         an 80px strip already in the next band's white. -->
    <div class="h-20" />
    <div class="h-20 bg-white" />

    <!--
      The stappenplan, also off `post-42.css`:

      - A further 36px of gutter inside the 1100px column, collapsing to 0
        below 768px.
      - This page runs the 19px kicker rather than the sitewide 18px, and its
        section title is the 28px step — not the 32px `Zo werkt het` uses on
        `/tarieven`.
      - The four cards are equal columns on a 12px gap, two-up from 1025px
        down. They carry no hover state on the live page.
      - The two 32px spacers around the grid halve to 16px below 1025px.
    -->
    <section id="stappenplan" class="bg-white px-[clamp(16px,4vw,40px)] pb-20">
      <div class="mx-auto max-w-[1100px] px-9 max-md:px-0">
        <p class="kicker mb-3 text-center text-[19px]">{{ zoWerktHet.stepsIntro.kicker }}</p>
        <h2 class="mb-8 text-center text-[28px] leading-[44px] tracking-[-0.025em] max-desk:mb-4">
          {{ zoWerktHet.stepsIntro.title }}
        </h2>

        <div class="grid grid-cols-2 gap-3 desk:grid-cols-4">
          <article
            v-for="step in zoWerktHet.steps"
            :key="step.title"
            class="flex flex-col gap-5 rounded-tile border border-line-ink p-6 max-md:p-3"
          >
            <img :src="step.icon" alt="" class="h-[50px] w-[50px] object-contain object-left">
            <div>
              <h3 class="mb-2.5 text-[19px] leading-[26px] max-md:text-base">{{ step.title }}</h3>
              <p class="text-[13px]">{{ step.body }}</p>
            </div>
          </article>
        </div>

        <p class="mt-8 text-center max-desk:mt-4">
          <NuxtLink
            :to="zoWerktHet.stepsLink.to"
            class="inline-flex items-center gap-3 font-display text-[15px] font-bold text-ink-800 underline"
          >
            {{ zoWerktHet.stepsLink.label }} <BtnArrow />
          </NuxtLink>
        </p>
      </div>
    </section>

    <ComparisonTable />

    <!-- The live trial block on this page sits on the page's own parchment,
         not on the white the comparison band ends in. -->
    <TrialCta ground="page" />

    <FaqSection />
  </div>
</template>
