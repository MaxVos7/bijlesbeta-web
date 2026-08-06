<script setup lang="ts">
import { contact, werkenBij } from '~/data/site'

// The hero opens on the dark ink band, so the sticky header strip follows it up.
definePageMeta({ headerGround: 'ink' })

useSeoMeta({
  title: 'Werken bij Bijles Bèta',
  description:
    'Heb jij passie voor de bèta vakken en vind je het leuk om dit te delen met middelbare scholieren? Solliciteer direct als docent bij Bijles Bèta in Groningen.',
})
</script>

<template>
  <div>
    <section
      id="top"
      class="bg-ink-900 px-[clamp(16px,4vw,24px)] pt-[clamp(24px,4vw,44px)] pb-[clamp(40px,6vw,72px)]"
    >
      <div
        class="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      >
        <div class="min-w-0">
          <RatingLine tone="inverse" class="mb-[18px]" />

          <h1
            class="mb-[18px] max-w-[16ch] text-[clamp(30px,4.2vw,48px)] leading-[1.12] tracking-[-0.025em] text-white"
          >
            {{ werkenBij.hero.title }}
          </h1>
          <p class="mb-7 max-w-[46ch] text-[clamp(15px,1.2vw,17px)] leading-[1.7] text-line-400 text-pretty">
            {{ werkenBij.hero.intro }}
          </p>

          <CheckList :items="werkenBij.hero.promises" class="mb-8 text-white" />

          <a
            href="#solliciteren"
            class="btn-primary gap-3.5 px-[26px] py-4 text-base shadow-[0_6px_18px_rgb(255_187_0_/_0.35)]"
          >
            {{ werkenBij.hero.cta }} <span class="text-lg" aria-hidden="true">→</span>
          </a>
          <p class="mt-3.5 text-[13px] text-ink-400">{{ werkenBij.hero.reassurance }}</p>
        </div>

        <div class="min-w-0">
          <img
            :src="werkenBij.hero.image"
            :alt="werkenBij.hero.imageAlt"
            class="mx-auto block aspect-[16/11] w-full max-w-[620px] object-contain"
            width="620"
            height="426"
          >
        </div>
      </div>
    </section>

    <section
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(56px,7vw,96px)] pb-[clamp(24px,3vw,40px)]"
    >
      <div class="mx-auto max-w-[1180px]">
        <div class="mb-[clamp(30px,4vw,46px)] text-center">
          <p class="kicker mb-2.5">{{ werkenBij.perksIntro.kicker }}</p>
          <h2 class="text-[clamp(24px,2.8vw,32px)] tracking-[-0.025em]">
            {{ werkenBij.perksIntro.title }}
          </h2>
        </div>

        <div
          class="grid gap-[clamp(14px,1.8vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
        >
          <div
            v-for="perk in werkenBij.perks"
            :key="perk.title"
            class="flex flex-col gap-3 rounded-tile border border-line-200 px-6 py-[26px]"
          >
            <!-- Placeholder for the illustrated icon — the drawings were not part
                 of the design export. Swap for an <img> once they land. -->
            <span
              class="h-[52px] w-[52px] flex-none rounded-panel border border-dashed border-line-300 bg-cream"
              aria-hidden="true"
            />
            <h3 class="mt-2 text-[17px] tracking-[-0.01em]">{{ perk.title }}</h3>
            <p class="text-sm leading-[1.62] text-ink-600">{{ perk.body }}</p>
          </div>
        </div>

        <p class="mt-[clamp(32px,4vw,48px)] text-center">
          <NuxtLink
            :to="werkenBij.perksLink.to"
            class="border-b-[1.5px] border-ink-900 pb-[3px] text-[15px] font-semibold"
          >
            {{ werkenBij.perksLink.label }}&nbsp;&nbsp;→
          </NuxtLink>
        </p>
      </div>
    </section>

    <section
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(48px,6vw,76px)] pb-[clamp(56px,7vw,90px)]"
    >
      <div class="mx-auto max-w-[1180px]">
        <div class="mb-[clamp(28px,3.5vw,42px)] text-center">
          <p class="kicker mb-2.5">{{ werkenBij.requirementsIntro.kicker }}</p>
          <h2 class="text-[clamp(24px,2.8vw,32px)] tracking-[-0.025em]">
            {{ werkenBij.requirementsIntro.title }}
          </h2>
        </div>

        <!-- Only the first card carries a photo; the other two pad their heads
             down so all three numbers sit on the same line. -->
        <div
          class="grid items-start gap-[clamp(16px,2vw,24px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
        >
          <article
            v-for="(requirement, index) in werkenBij.requirements"
            :key="requirement.title"
            class="flex flex-col overflow-hidden rounded-card border border-line-200"
          >
            <img
              v-if="requirement.image"
              :src="requirement.image"
              :alt="requirement.alt ?? ''"
              class="block aspect-[16/10] w-full object-cover"
              loading="lazy"
            >
            <div
              class="flex flex-1 flex-col items-start gap-3 p-6"
              :class="!requirement.image && 'pt-[clamp(24px,10vw,150px)]'"
            >
              <span
                class="inline-flex items-center justify-center rounded-btn bg-brand-500 px-[9px] py-[3px] text-[13px] font-bold text-ink-800"
              >
                {{ index + 1 }}.
              </span>
              <h3 class="text-[17px] tracking-[-0.01em]">{{ requirement.title }}</h3>
              <p class="text-sm leading-[1.65] text-ink-700 text-pretty">{{ requirement.body }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section
      id="solliciteren"
      class="scroll-mt-24 bg-sand px-[clamp(16px,4vw,24px)] pt-[clamp(48px,6vw,80px)] pb-[clamp(56px,7vw,90px)]"
    >
      <div
        class="mx-auto grid max-w-[1180px] items-end gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      >
        <div class="min-w-0">
          <p class="kicker mb-2.5">{{ werkenBij.apply.kicker }}</p>
          <h2
            class="mb-[18px] text-[clamp(26px,3.2vw,38px)] leading-[1.14] tracking-[-0.03em]"
          >
            {{ werkenBij.apply.title }}
          </h2>
          <p class="mb-[26px] max-w-[44ch] text-sm leading-[1.75] text-ink-600 text-pretty">
            {{ werkenBij.apply.body }}
          </p>

          <a
            :href="contact.applicationsEmailHref"
            class="inline-flex items-center gap-3.5 text-[15px] font-semibold"
          >
            <span
              class="inline-flex h-[38px] w-[38px] flex-none items-center justify-center rounded-field bg-brand-100"
            >
              <svg
                class="h-[18px] w-[18px] text-brand-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </span>
            {{ contact.applicationsEmail }}
          </a>
        </div>

        <ApplicationForm />
      </div>
    </section>
  </div>
</template>
