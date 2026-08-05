<script setup lang="ts">
import { findLanding, landingHeroForm, landingPromises, landingSteps } from '~/data/landings'
import { reassurance, teamIntro } from '~/data/site'

/**
 * One template for every subject/level/location landing page. These 11 pages
 * don't form a clean subject×city matrix — they're independently-authored
 * flat slugs (`vmbo`, `aan-huis`, `wiskunde-a-groningen`, …) — so the route
 * carries a single slug and the copy comes from `app/data/landings.ts`.
 * Adding a page is a data entry here, not a new page file.
 */
definePageMeta({
  layout: 'landing',
  validate: (route) => findLanding(String(route.params.slug)) !== undefined,
})

const route = useRoute()

// `validate` has already rejected anything unknown by the time we render.
const landing = findLanding(String(route.params.slug))!

useSeoMeta({
  title: landing.title,
  description: landing.seoDescription || undefined,
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-ink-900 pb-[clamp(48px,7vw,88px)]">
      <img
        src="/img/lab.jpg"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
      <div class="hero-scrim pointer-events-none absolute inset-0" />

      <SiteHeader transparent />

      <div class="relative px-[clamp(12px,3vw,24px)] pt-[clamp(36px,5vw,72px)]">
        <div
          class="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
        >
          <div class="min-w-0 text-white">
            <RatingLine tone="inverse" class="mb-[18px]" />

            <h1
              class="mb-[18px] max-w-[16ch] text-[clamp(30px,4.2vw,48px)] leading-[1.12] tracking-[-0.025em] text-white text-pretty"
            >
              {{ landing.title }}
            </h1>
            <p class="mb-7 max-w-[46ch] text-[clamp(15px,1.2vw,17px)] leading-relaxed text-white/85">
              {{ landing.intro }}
            </p>

            <CheckList :items="landingPromises" class="mb-8 font-semibold" />

            <NuxtLink
              to="/aanmelden"
              class="btn-primary gap-3.5 rounded-panel px-[26px] py-4 text-base shadow-[0_6px_18px_rgb(245_179_1_/_0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgb(245_179_1_/_0.42)]"
            >
              Gratis proefles <span class="text-lg" aria-hidden="true">→</span>
            </NuxtLink>
            <p class="mt-3.5 text-[13px] text-white/65">{{ reassurance }}</p>
          </div>

          <div
            class="w-full min-w-0 max-w-[470px] justify-self-end rounded-[20px] bg-brand-500 p-[clamp(20px,2.4vw,30px)]"
          >
            <p class="mb-1.5 text-[15px] font-semibold text-on-brand">{{ landingHeroForm.kicker }}</p>
            <h2 class="mb-2.5 text-[clamp(21px,2.2vw,27px)] tracking-[-0.025em]">
              {{ landingHeroForm.title }}
            </h2>
            <p class="mb-[18px] text-sm leading-relaxed text-on-brand-muted">
              {{ landingHeroForm.body }}
            </p>

            <LeadForm
              :source="`Aanvraag voor een gratis proefles via de landingspagina ${route.path}.`"
              class="rounded-tile bg-cream p-[clamp(14px,1.6vw,18px)]"
            />
          </div>
        </div>
      </div>
    </section>

    <section
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(48px,6vw,80px)] pb-[clamp(40px,5vw,64px)]"
    >
      <div class="mx-auto max-w-[1180px]">
        <div class="mb-[clamp(28px,3.5vw,42px)] text-center">
          <p class="kicker mb-2">{{ landingSteps.kicker }}</p>
          <h2 class="text-[clamp(24px,2.8vw,32px)] tracking-[-0.025em]">{{ landingSteps.title }}</h2>
        </div>

        <div
          class="grid gap-[clamp(16px,2vw,24px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
        >
          <article
            v-for="step in landingSteps.items"
            :key="step.label"
            class="flex flex-col rounded-tile border border-line-200 p-3.5 pb-[26px] transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_16px_34px_rgb(31_29_28_/_0.10)]"
          >
            <img
              :src="step.image"
              :alt="step.alt"
              class="mb-5 block aspect-video w-full rounded-panel object-cover"
              loading="lazy"
            >
            <span
              class="mb-3.5 self-start rounded-md bg-brand-500 px-2.5 py-[5px] text-[13px] font-bold"
            >
              {{ step.label }}
            </span>
            <h3 class="mb-2.5 text-lg tracking-[-0.01em]">{{ step.title }}</h3>
            <p class="text-sm leading-[1.7] text-ink-700">{{ step.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <section
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(32px,4vw,56px)] pb-[clamp(48px,6vw,80px)]"
    >
      <div
        class="mx-auto grid max-w-[1180px] items-center gap-[clamp(28px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      >
        <div class="min-w-0">
          <p class="kicker mb-2">{{ landing.kicker }}</p>
          <h2 class="mb-6 text-[clamp(24px,2.8vw,32px)] tracking-[-0.025em]">
            {{ landing.seoTitle }}
          </h2>
          <p
            v-for="(paragraph, index) in landing.seoParagraphs"
            :key="index"
            class="text-[15px] leading-[1.85] not-last:mb-4"
          >
            <template v-for="(segment, segIndex) in paragraph" :key="segIndex">
              <NuxtLink
                v-if="segment.to"
                :to="segment.to"
                class="font-semibold text-ink-900 underline decoration-line-300 underline-offset-2 hover:decoration-ink-900"
              >{{ segment.text }}</NuxtLink>
              <template v-else>{{ segment.text }}</template>
            </template>
          </p>

          <div class="mt-[26px] flex flex-wrap gap-x-[26px] gap-y-3.5 text-[15px] font-semibold">
            <NuxtLink to="/tarieven" class="border-b-[1.5px] border-ink-900 pb-[3px]">
              Bekijk onze tarieven&nbsp;&nbsp;→
            </NuxtLink>
            <NuxtLink to="/tarieven#zo-werkt-het" class="border-b-[1.5px] border-ink-900 pb-[3px]">
              Hoe het werkt&nbsp;&nbsp;→
            </NuxtLink>
          </div>
        </div>

        <div class="min-w-0">
          <img
            :src="landing.image"
            :alt="landing.imageAlt"
            class="ml-auto block h-auto w-full max-w-[475px]"
            loading="lazy"
          >
        </div>
      </div>
    </section>

    <section
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(40px,5vw,64px)] pb-[clamp(56px,7vw,90px)]"
    >
      <div class="mx-auto max-w-[1180px]">
        <FeatureGrid />
      </div>
    </section>

    <section class="bg-sand px-[clamp(16px,4vw,24px)] py-[clamp(56px,7vw,88px)]">
      <div class="mx-auto max-w-[1180px]">
        <div class="mb-[clamp(26px,3.5vw,38px)] text-center">
          <RatingLine centered class="mb-3" />
          <h2 class="text-[clamp(23px,2.6vw,30px)] tracking-[-0.025em]">
            Wat vinden onze leerlingen?
          </h2>
        </div>

        <ReviewCarousel />

        <p class="mt-[clamp(26px,3vw,36px)] text-center">
          <a
            href="https://www.google.com/search?q=Bijles+B%C3%A8ta+Groningen+reviews"
            rel="noopener"
            target="_blank"
            class="border-b-[1.5px] border-ink-900 pb-[3px] text-[15px] font-semibold"
          >
            Meer google reviews&nbsp;&nbsp;→
          </a>
        </p>
      </div>
    </section>

    <TrialCta class="pt-[clamp(56px,7vw,88px)]" />

    <section
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(24px,3vw,40px)] pb-[clamp(40px,5vw,60px)]"
    >
      <div class="mx-auto max-w-[1180px]">
        <PricingSection />
      </div>
    </section>

    <section
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(48px,6vw,80px)] pb-[clamp(64px,8vw,100px)]"
    >
      <div class="mx-auto max-w-[1080px]">
        <p class="kicker mb-2.5">{{ teamIntro.kicker }}</p>
        <h2 class="mb-5 text-[clamp(23px,2.5vw,30px)] tracking-[-0.025em]">{{ teamIntro.title }}</h2>
        <p class="mb-7 max-w-[46ch] text-[15px] leading-[1.75] text-ink-700">{{ teamIntro.body }}</p>
        <NuxtLink to="/over-ons#team" class="btn-secondary gap-3 hover:border-brand-500 hover:bg-ivory">
          Ons team →
        </NuxtLink>
      </div>
    </section>

    <FaqSection />
  </div>
</template>
