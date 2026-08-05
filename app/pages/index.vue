<script setup lang="ts">
import { landingPath } from '~/data/landings'
import {
  heroPromises,
  reassurance,
  story,
  subjectCards,
  teamIntro,
} from '~/data/site'

useSeoMeta({
  title: 'Bijles wiskunde, natuurkunde en scheikunde in Groningen',
  description:
    'Persoonlijke bijles in de bètavakken door studenten van de Rijksuniversiteit Groningen. Start altijd met een gratis proefles.',
})
</script>

<template>
  <div>
    <section
      id="top"
      class="bg-cream px-[clamp(16px,4vw,24px)] pt-[clamp(24px,4vw,44px)] pb-[clamp(48px,7vw,88px)]"
    >
      <div
        class="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      >
        <div class="min-w-0">
          <RatingLine class="mb-[18px]" />

          <h1
            class="mb-[18px] max-w-[16ch] text-[clamp(30px,4.2vw,48px)] leading-[1.12] tracking-[-0.025em] text-pretty"
          >
            Bijles wiskunde, natuurkunde en scheikunde in Groningen
          </h1>
          <p class="mb-7 max-w-[46ch] text-[clamp(15px,1.2vw,17px)] leading-relaxed text-ink-600">
            Krijg weer grip op bètavakken met persoonlijke begeleiding van onze topdocenten van de
            Rijksuniversiteit.
          </p>

          <CheckList :items="heroPromises" class="mb-8" />

          <NuxtLink
            to="/aanmelden"
            class="btn-primary gap-3.5 rounded-panel px-[26px] py-4 text-base shadow-[0_6px_18px_rgb(245_179_1_/_0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgb(245_179_1_/_0.42)]"
          >
            Gratis proefles <span class="text-lg" aria-hidden="true">→</span>
          </NuxtLink>
          <p class="mt-3.5 text-[13px] text-ink-400">{{ reassurance }}</p>
        </div>

        <div class="min-w-0">
          <img
            src="/img/map.png"
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
      <div class="mx-auto max-w-[1180px]">
        <FeatureGrid />
      </div>
    </section>

    <section
      id="vakken"
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(48px,6vw,76px)] pb-[clamp(56px,7vw,90px)]"
    >
      <div class="mx-auto max-w-[1180px]">
        <div class="mb-[clamp(28px,3.5vw,42px)] text-center">
          <p class="kicker mb-2.5">Specialisten in Bèta</p>
          <h2 class="text-[clamp(24px,2.8vw,32px)] tracking-[-0.025em]">Onze vakken op een rijtje</h2>
        </div>

        <div
          class="grid gap-[clamp(16px,2vw,24px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
        >
          <article
            v-for="subject in subjectCards"
            :key="subject.slug"
            class="flex flex-col overflow-hidden rounded-card border border-line-200 transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_16px_34px_rgb(31_29_28_/_0.10)]"
          >
            <img
              :src="subject.image"
              :alt="subject.alt"
              class="block aspect-video w-full object-cover"
              loading="lazy"
            >
            <div class="flex flex-1 flex-col items-start gap-3 p-6">
              <h3 class="text-xl tracking-[-0.02em]">{{ subject.name }}</h3>
              <p class="mb-auto text-sm leading-[1.65] text-ink-700">{{ subject.body }}</p>
              <NuxtLink :to="landingPath(subject.slug)" class="btn-primary mt-2 gap-3 px-5 py-3">
                Kijk verder →
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="verhaal" class="bg-white px-[clamp(16px,4vw,24px)] pb-[clamp(56px,7vw,90px)]">
      <div
        class="mx-auto grid max-w-[1040px] overflow-hidden rounded-[20px] bg-sand [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
      >
        <img
          src="/img/studenten.png"
          alt="Leerlingen aan tafel tijdens de bijles"
          class="block h-full min-h-[340px] w-full object-cover"
          loading="lazy"
        >
        <div class="px-[clamp(26px,3.5vw,48px)] py-[clamp(32px,4.5vw,58px)]">
          <p class="kicker mb-2">{{ story.kicker }}</p>
          <h2 class="mb-5 text-[clamp(23px,2.5vw,30px)] tracking-[-0.025em]">{{ story.title }}</h2>
          <p class="mb-7 text-[15px] leading-[1.75] text-ink-700">{{ story.body }}</p>
          <NuxtLink to="/over-ons" class="btn-secondary gap-3 hover:border-brand-500 hover:bg-ivory">
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
        class="mx-auto grid max-w-[1080px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
      >
        <div class="min-w-0">
          <p class="kicker mb-2.5">{{ teamIntro.kicker }}</p>
          <h2 class="mb-5 text-[clamp(23px,2.5vw,30px)] tracking-[-0.025em]">{{ teamIntro.title }}</h2>
          <p class="mb-7 max-w-[46ch] text-[15px] leading-[1.75] text-ink-700">{{ teamIntro.body }}</p>
          <NuxtLink to="/over-ons#team" class="btn-secondary gap-3 hover:border-brand-500 hover:bg-ivory">
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
      <div class="mx-auto max-w-[1180px]">
        <div class="mb-[clamp(26px,3.5vw,38px)] text-center">
          <RatingLine centered class="mb-3" />
          <h2 class="text-[clamp(23px,2.6vw,30px)] tracking-[-0.025em]">Wat vinden onze leerlingen?</h2>
        </div>

        <ReviewCarousel />
      </div>
    </section>

    <TrialCta class="pt-[clamp(56px,7vw,88px)]" />

    <FaqSection />
  </div>
</template>
