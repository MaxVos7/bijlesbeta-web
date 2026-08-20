<script setup lang="ts">
import { landingPath } from '~/data/landings'
import {
  heroPromises,
  story,
  subjectCards,
  teamIntro,
} from '~/data/site'

useSeo({
  // Absolute: the live homepage is the one page that leads with the brand.
  absoluteTitle: true,
  title: 'Bijles Bèta | Bijles wiskunde, natuurkunde en scheikunde in Groningen',
  description:
    'Bijles wiskunde, natuurkunde en scheikunde in Groningen en Drenthe. Ervaren RUG-studenten geven persoonlijke begeleiding bij jou thuis. Plan nu een proefles!',
})
</script>

<template>
  <div>
    <!-- The hero has no ground of its own: it sits on the page's own
         parchment, so the header strip above it continues the same band
         rather than cutting a paler line across the top of the page. -->
    <section
      id="top"
      class="px-[clamp(16px,4vw,24px)] pt-[clamp(24px,4vw,44px)] pb-[clamp(48px,7vw,88px)]"
    >
      <div
        class="mx-auto grid max-w-[1100px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      >
        <div class="min-w-0">
          <RatingLine class="mb-[18px]" />

          <!-- 32px over a 25ch measure so the headline breaks over two lines,
               as it does on bijlesbeta.nl — which also drops to 26px below
               768px and holds the 44px leading at both sizes. -->
          <h1
            class="mb-[18px] max-w-[25ch] text-[26px] leading-[44px] tracking-[-0.025em] text-pretty md:text-[32px]"
          >
            Bijles wiskunde, natuurkunde en scheikunde in Groningen
          </h1>
          <p class="mb-7 max-w-[46ch] text-base leading-[1.7] text-ink-600">
            Krijg weer grip op bètavakken met persoonlijke begeleiding van onze topdocenten van de
            Rijksuniversiteit.
          </p>

          <CheckList :items="heroPromises" class="mb-8" />

          <NuxtLink
            to="/aanmelden"
            class="btn-primary px-6 py-5"
          >
            Gratis proefles <span class="text-lg" aria-hidden="true">→</span>
          </NuxtLink>
          <CtaNote class="mt-3.5" />
        </div>

        <div class="min-w-0">
          <img
            src="/img/map.svg"
            alt="Bijles aan huis in heel Groningen"
            class="mx-auto block h-auto w-full max-w-[620px]"
          >
        </div>
      </div>
    </section>

    <section
      id="over"
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(56px,7vw,96px)] pb-[clamp(24px,3vw,40px)]"
    >
      <div class="mx-auto max-w-[1400px]">
        <FeatureGrid />
      </div>
    </section>

    <section
      id="vakken"
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(48px,6vw,76px)] pb-[clamp(56px,7vw,90px)]"
    >
      <div class="mx-auto max-w-[1400px]">
        <div class="mb-[clamp(28px,3.5vw,42px)] text-center">
          <p class="kicker mb-2.5">Specialisten in Bèta</p>
          <h2 class="text-[28px] leading-[44px] tracking-[-0.025em]">Onze vakken op een rijtje</h2>
        </div>

        <!-- Three across or one — an auto-fit track would land on a two-up
             state between the two, which the three subjects never sit well in. -->
        <div class="grid grid-cols-1 gap-[clamp(16px,2vw,24px)] md:grid-cols-3">
          <article
            v-for="subject in subjectCards"
            :key="subject.slug"
            class="flex flex-col overflow-hidden rounded-card border border-line-ink"
          >
            <img
              :src="subject.image"
              :alt="subject.alt"
              class="block aspect-video w-full object-cover"
              loading="lazy"
            >
            <div class="flex flex-1 flex-col items-center gap-3 p-6 text-center">
              <h3 class="text-[19px] leading-[20px] tracking-[-0.02em]">{{ subject.name }}</h3>
              <p class="mb-auto text-[15px] leading-[28px] text-ink-700">{{ subject.body }}</p>
              <NuxtLink :to="landingPath(subject.slug)" class="btn-primary mt-2">
                Kijk verder →
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="verhaal" class="bg-white px-[clamp(16px,4vw,24px)] pb-[clamp(56px,7vw,90px)]">
      <div
        class="mx-auto grid max-w-[1100px] overflow-hidden rounded-card bg-sand [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
      >
        <img
          src="/img/studenten.png"
          alt="Leerlingen aan tafel tijdens de bijles"
          class="block h-full min-h-[340px] w-full object-cover"
          loading="lazy"
        >
        <div class="px-[clamp(26px,3.5vw,48px)] py-[clamp(32px,4.5vw,58px)]">
          <p class="kicker mb-2">{{ story.kicker }}</p>
          <h2 class="mb-5 text-[clamp(23px,2.5vw,28px)] tracking-[-0.025em]">{{ story.title }}</h2>
          <p class="mb-7 text-base leading-[1.75] text-ink-700">{{ story.body }}</p>
          <NuxtLink to="/over-ons" class="btn-secondary gap-3 hover:border-brand-500 hover:bg-linen">
            Lees ons verhaal →
          </NuxtLink>
        </div>
      </div>
    </section>

    <StatsBand />

    <section
      id="werken"
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(24px,3vw,40px)] pb-[clamp(64px,8vw,100px)]"
    >
      <div
        class="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
      >
        <div class="min-w-0">
          <p class="kicker mb-2.5">{{ teamIntro.kicker }}</p>
          <h2 class="mb-5 text-[clamp(23px,2.5vw,28px)] tracking-[-0.025em]">{{ teamIntro.title }}</h2>
          <p class="mb-7 max-w-[46ch] text-base leading-[1.75] text-ink-700">{{ teamIntro.body }}</p>
          <NuxtLink to="/over-ons#team" class="btn-secondary gap-3 hover:border-brand-500 hover:bg-linen">
            Ons team →
          </NuxtLink>
        </div>
        <div class="min-w-0">
          <img
            src="/img/team-collage.png"
            alt="Het team van Bijles Bèta"
            class="mx-auto block h-auto w-full max-w-[520px]"
            loading="lazy"
          >
        </div>
      </div>
    </section>

    <section id="reviews" class="bg-sand px-[clamp(16px,4vw,24px)] py-[clamp(56px,7vw,88px)]">
      <div class="mx-auto max-w-[1000px]">
        <div class="mb-[clamp(26px,3.5vw,38px)] text-center">
          <RatingLine centered class="mb-3" />
          <h2 class="text-[clamp(23px,2.6vw,28px)] tracking-[-0.025em]">Wat vinden onze leerlingen?</h2>
        </div>

        <ReviewCarousel />

        <p class="mt-[clamp(24px,3vw,34px)] text-center">
          <a
            href="https://www.google.com/search?q=bijles+b%C3%A8ta+groningen+reviews"
            rel="noopener"
            target="_blank"
            class="border-b-[1.5px] border-ink-900 pb-[3px] text-[15px] font-semibold"
          >
            Meer google reviews →
          </a>
        </p>
      </div>
    </section>

    <TrialCta class="pt-[clamp(56px,7vw,88px)]" />

    <FaqSection />
  </div>
</template>
