<script setup lang="ts">
/**
 * Measured against bijlesbeta.nl/het-bedrijf/ (`post-1567.css`), not designed
 * — the same treatment `/tarieven` and `/contact` had. The numbers below are
 * the live page's and shouldn't be tidied:
 *
 * - **Only the hero runs the 1100px column.** Every other band takes the kit
 *   default, `min(100%, 1400px)`, so the story bands and the innovations list
 *   are visibly wider than the headline above them. `--content-width:1100px`
 *   is set on the hero container alone.
 * - **The bands are separated by 80px spacer strips**, as on `/tarieven`, and
 *   the first of the five sits on parchment while the other four are already
 *   white — that is where the page changes ground.
 * - **Headings run `tracking-normal`.** The site's base heading rule is
 *   `tracking-tight`, which is the design handoff's, but every heading on this
 *   Elementor page is at normal letter-spacing.
 * - **Section titles are 32px/44px**, not the 28px step, and hold that size at
 *   every width: `post-1567.css` has no 767px step for them.
 * - **The three CTAs invert to ink-900 on hover**, like the header's, rather
 *   than stepping to `brand-600` the way `btn-primary` does on its own.
 * - **Body copy is 15px/24px and not muted.** The live widgets set `#1D1D1B`;
 *   we leave it unclassed, which is `ink-800` — the departure CLAUDE.md
 *   records under "Headings and copy both sit on ink-800". Only the hero
 *   paragraph is `ink-700`, and that is the live value.
 * - **Inline links are the live page's `#c36`, no underline** (see
 *   `copy-live-links`), not the sitewide ink-900 underline.
 *
 * The hero's `#het-onstaan` target is a dead anchor on bijlesbeta.nl; the
 * first band carries the id here so the button does what its label says.
 */
import { hetBedrijf } from '~/data/site'

useSeo({
  // Absolute: the live title carries no brand suffix at all.
  absoluteTitle: true,
  title: 'Over Bijles Bèta, wat ons Groningse bedrijf uniek en innovatief maakt',
  description:
    'Bijles Bèta is opgericht in 2017 door Mathijn en Max. Wij bieden bijles wiskunde, natuurkunde en scheikunde aan huis in Groningen door gepassioneerde studenten.',
})

/** Elementor's own gutter: 40px, tapering to 16px on a phone. */
const band = 'px-[clamp(16px,4vw,40px)]'

/** The amber in-page CTA, which inverts rather than stepping to brand-600. */
const cta
  = 'btn-primary btn-lg self-start hover:bg-ink-900 hover:text-white focus-visible:bg-ink-900 focus-visible:text-white'
</script>

<template>
  <div>
    <!-- Hero. Transparent, so it sits on the page's own parchment. -->
    <section id="top" :class="band">
      <div class="mx-auto grid max-w-[1100px] desk:grid-cols-2 desk:gap-x-[100px]">
        <div class="flex flex-col justify-center gap-3 pt-8 pb-5 md:pt-[52px] md:pb-[92px]">
          <RatingLine />
          <h1 class="text-[32px] leading-[44px] tracking-normal">
            {{ hetBedrijf.hero.title }}
          </h1>
          <p class="text-[16px] leading-6 text-ink-700">
            {{ hetBedrijf.hero.body }}
          </p>
          <!--
            The one button on the page that isn't amber: parchment on a 1px
            black-at-20% rule, and it inverts on hover like the others.
          -->
          <a
            :href="hetBedrijf.hero.cta.href"
            class="btn btn-lg self-start border border-black/20 bg-parchment text-ink-800 hover:bg-ink-900 hover:text-white focus-visible:bg-ink-900 focus-visible:text-white"
          >
            {{ hetBedrijf.hero.cta.label }} <BtnArrow />
          </a>
        </div>

        <!-- 50% wide from the tablet floor up, but only beside the copy at
             1025px — below that the live hero stacks with no gutter. -->
        <div class="w-full md:w-1/2 desk:w-full">
          <img
            :src="hetBedrijf.hero.image"
            :alt="hetBedrijf.hero.imageAlt"
            class="block h-[358px] w-full rounded-tile object-cover object-[center_left]"
          >
        </div>
      </div>
    </section>

    <!-- The ground changes here: 80px of parchment, then 80px of white. -->
    <div class="h-20" />
    <div class="h-20 bg-white" />

    <template v-for="(block, index) in hetBedrijf.blocks" :key="block.title">
      <section :id="block.id" class="bg-white" :class="band">
        <div class="mx-auto flex max-w-[1400px] flex-col gap-[72px] md:flex-row">
          <div class="flex flex-col gap-2.5 p-6 md:w-1/2">
            <h2 class="text-[32px] leading-[44px] tracking-normal">{{ block.title }}</h2>
            <div class="copy-live-links text-[15px] leading-6">
              <p v-for="(paragraph, pIndex) in block.body" :key="pIndex">
                <ArticleRuns :runs="paragraph" />
              </p>
            </div>
            <NuxtLink v-if="block.cta" :to="block.cta.to" :class="cta">
              {{ block.cta.label }} <BtnArrow />
            </NuxtLink>
          </div>

          <div
            class="relative min-h-[333px] overflow-hidden rounded-block md:w-1/2"
            :class="block.photo === 'left' && 'md:order-first'"
          >
            <img
              :src="block.image"
              :alt="block.imageAlt"
              class="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            >
          </div>
        </div>
      </section>

      <div v-if="index < hetBedrijf.blocks.length - 1" class="h-20 bg-white" />
    </template>

    <div class="h-20 bg-white" />

    <section class="bg-white" :class="band">
      <div class="mx-auto max-w-[1400px]">
        <div class="flex flex-col gap-2.5 p-6">
          <!-- This page's kicker is the 19px one, as on the packages band. -->
          <p class="kicker text-[19px]">{{ hetBedrijf.innovaties.kicker }}</p>
          <h2 class="text-[32px] leading-[44px] tracking-normal">
            {{ hetBedrijf.innovaties.title }}
          </h2>
          <div class="copy-live-links text-[15px] leading-6">
            <p v-for="(paragraph, index) in hetBedrijf.innovaties.intro" :key="index">
              <ArticleRuns :runs="paragraph" />
            </p>
          </div>

          <template v-for="(item, index) in hetBedrijf.innovaties.items" :key="item.title">
            <h3 class="text-[19px] leading-[19px] tracking-normal">
              {{ index + 1 }}. {{ item.title }}
            </h3>
            <div class="copy-live-links text-[15px] leading-6">
              <p v-for="(paragraph, pIndex) in item.body" :key="pIndex">
                <ArticleRuns :runs="paragraph" />
              </p>
            </div>
          </template>
        </div>
      </div>
    </section>

    <FaqSection />
  </div>
</template>
