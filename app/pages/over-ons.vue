<script setup lang="ts">
import { heroPromises, overOnsBlocks } from '~/data/site'
import { findTutor, tutors } from '~/data/tutors'

useSeo({
  title: 'Over ons',
  description:
    'Opgericht door een groep ambitieuze studenten met een duidelijke visie: onze passie voor Bèta vakken delen met Groningen.',
})

// The grid is broken up by a story card and a full-width photo, so the roster
// is split into three runs rather than rendered as one list.
const firstRun = computed(() => tutors.slice(0, 6))
const secondRun = computed(() => tutors.slice(6, 10))
const rest = computed(() => tutors.slice(10))

const storyTutor = computed(() => findTutor('jelmer-spoor') ?? tutors[0]!)

const storyQuote = computed(() => {
  const intro = storyTutor.value.bio[0] ?? ''
  return intro.length > 160 ? `${intro.slice(0, 160).trimEnd()}…` : intro
})
</script>

<template>
  <div>
    <!-- No ground of its own — the page's parchment runs up behind the
         header strip, as on the live page. -->
    <section
      class="px-[clamp(16px,4vw,24px)] pt-[clamp(28px,4vw,48px)] pb-[clamp(48px,7vw,84px)]"
    >
      <div
        class="mx-auto grid max-w-[1100px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      >
        <div class="min-w-0">
          <p class="kicker mb-2.5">Over ons</p>
          <h1 class="mb-[18px] text-[clamp(28px,3.6vw,32px)] leading-[1.14] tracking-[-0.03em]">
            Samen een passie voor Bèta
          </h1>
          <p class="mb-[26px] max-w-[46ch] text-[clamp(15px,1.2vw,16px)] leading-[1.65] text-ink-600">
            Opgericht door een groep ambitieuze studenten met een duidelijke visie: onze passie voor
            Bèta vakken delen met zoveel mogelijk leerlingen.
          </p>

          <CheckList :items="heroPromises" class="mb-[30px]" />

          <NuxtLink
            to="/aanmelden"
            class="btn-primary gap-3.5 px-6 py-[15px] text-[15px]"
          >
            Direct aanmelden <span class="text-lg" aria-hidden="true">→</span>
          </NuxtLink>
          <CtaNote class="mt-3.5" />
        </div>

        <div class="min-w-0">
          <img
            src="/img/team-collage.webp"
            alt="Ons team"
            class="mx-auto block h-auto w-full max-w-[480px]"
          >
        </div>
      </div>
    </section>

    <section
      id="team"
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(48px,6vw,80px)] pb-[clamp(30px,4vw,50px)]"
    >
      <div
        class="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 md:grid-cols-2 desk:grid-cols-4"
      >
        <TutorCard v-for="tutor in firstRun" :key="tutor.slug" :tutor="tutor" />

        <figure
          class="flex flex-col items-center rounded-tile bg-sand p-[clamp(24px,3vw,34px)] text-center md:col-span-2"
        >
          <figcaption class="mb-4 text-sm font-semibold">
            Het verhaal van {{ storyTutor.name }}
          </figcaption>
          <blockquote
            class="mb-3.5 max-w-[44ch] text-[clamp(16px,1.6vw,19px)] leading-[1.5] font-bold tracking-[-0.02em]"
          >
            “{{ storyQuote }}
          </blockquote>
          <NuxtLink
            :to="`/docenten/${storyTutor.slug}`"
            class="mb-auto border-b-[1.5px] border-ink-900 text-sm"
          >
            Lees meer
          </NuxtLink>
          <div class="mt-[26px] flex items-center gap-3 self-start text-left">
            <img
              :src="storyTutor.photo"
              :alt="storyTutor.name"
              class="block h-11 w-11 flex-none rounded-field bg-linen object-cover"
              loading="lazy"
            >
            <div>
              <p class="text-[13.5px] font-bold">{{ storyTutor.name }}</p>
              <p class="text-xs text-ink-400">{{ storyTutor.study }}</p>
            </div>
          </div>
        </figure>

        <TutorCard v-for="tutor in secondRun" :key="tutor.slug" :tutor="tutor" />
      </div>
    </section>

    <section class="bg-white px-[clamp(16px,4vw,24px)] pb-[clamp(24px,3vw,40px)]">
      <div class="relative mx-auto max-w-[1400px] overflow-hidden rounded-tile">
        <!-- The 16/5 band cuts a strip out of a 4:3 photograph, so the crop is
             pulled up to where the team stands rather than centred on the
             shuffleboard table. -->
        <img
          src="/img/teamuitje.webp"
          alt="Het team van Bijles Bèta tijdens het teamuitje"
          class="block aspect-[16/5] w-full object-cover object-[center_12%]"
          loading="lazy"
        >
        <span
          class="pointer-events-none absolute right-[18px] bottom-3.5 text-[13px] font-bold text-white [text-shadow:0_1px_6px_rgb(0_0_0_/_0.5)]"
        >
          Teamuitje 2025
        </span>
      </div>
    </section>

    <section class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(24px,3vw,40px)] pb-[clamp(56px,7vw,90px)]">
      <div
        class="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 md:grid-cols-2 desk:grid-cols-4"
      >
        <TutorCard v-for="tutor in rest" :key="tutor.slug" :tutor="tutor" />
      </div>
    </section>

    <ComparisonTable />

    <section
      v-for="(block, index) in overOnsBlocks"
      :key="block.title"
      class="bg-white px-[clamp(16px,4vw,24px)] pb-[clamp(40px,5vw,70px)]"
    >
      <div
        class="mx-auto grid max-w-[1400px] items-center gap-[clamp(30px,4.5vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
      >
        <img
          v-if="index % 2 === 1"
          :src="block.image"
          :alt="block.alt"
          class="block aspect-[16/10] w-full min-w-0 rounded-tile object-cover"
          loading="lazy"
        >

        <div class="min-w-0">
          <h2 class="mb-[18px] text-[clamp(22px,2.5vw,28px)] tracking-[-0.025em]">{{ block.title }}</h2>
          <p class="mb-[26px] text-sm leading-[1.75] text-ink-700">{{ block.body }}</p>
          <NuxtLink :to="block.cta.to" class="btn-primary gap-3 px-5 py-[13px]">
            {{ block.cta.label }} <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>

        <img
          v-if="index % 2 === 0"
          :src="block.image"
          :alt="block.alt"
          class="block aspect-[16/10] w-full min-w-0 rounded-tile object-cover"
          loading="lazy"
        >
      </div>
    </section>

    <TrialCta />

    <FaqSection />
  </div>
</template>
