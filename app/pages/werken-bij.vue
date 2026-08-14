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
    <!--
      Hero. Measured off post-45.css rather than designed: a 1200px band on the
      deep ink, split 50/50 with a 100px gutter, the text column padded 72px
      over 92px. The live band also carries 192px of top padding because its
      header floats over it; ours sits in flow, so that padding lives in the
      header strip instead.
    -->
    <section id="top" class="bg-ink-900 px-5 md:px-10">
      <div
        class="mx-auto grid max-w-[1200px] gap-5 pb-20 md:grid-cols-2 md:gap-[100px] md:pb-0"
      >
        <div class="flex min-w-0 flex-col justify-center pt-[72px] md:pb-[92px]">
          <RatingLine tone="inverse" />

          <h1
            class="mt-4 mb-1 text-[26px] leading-[1.2] text-white md:text-[32px] md:leading-[44px]"
          >
            {{ werkenBij.hero.title }}
          </h1>
          <p class="max-w-[46ch] text-[16px] leading-[28px] text-white text-pretty">
            {{ werkenBij.hero.intro }}
          </p>

          <CheckList
            :items="werkenBij.hero.promises"
            class="mt-3 mb-6 font-semibold text-white"
          />

          <!--
            Not `btn-primary`: this one CTA inverts on the dark band — parchment
            with a hairline, stepping to the amber on hover, which is the live
            button exactly (20px/24px padding on `btn`'s 11px leading).
          -->
          <a
            href="#solliciteren"
            class="btn self-start border border-black/20 bg-parchment px-6 py-5 text-ink-900 hover:bg-brand-500 hover:text-ink-900"
          >
            {{ werkenBij.hero.cta }} <span class="text-lg leading-[11px]" aria-hidden="true">→</span>
          </a>
          <p class="mt-3 text-[12px] text-white">{{ werkenBij.hero.reassurance }}</p>
        </div>

        <div class="flex min-w-0 flex-col justify-center">
          <img
            :src="werkenBij.hero.image"
            :alt="werkenBij.hero.imageAlt"
            class="block h-[350px] w-full object-cover object-center md:h-[450px]"
            width="474"
            height="510"
          >
        </div>
      </div>
    </section>

    <!-- Perks. One white band carries this and the requirements below it. -->
    <section class="bg-white px-5 pt-20 md:px-10">
      <div class="mx-auto max-w-[1200px] md:px-9">
        <div class="mb-8 flex flex-col gap-2 text-center">
          <p class="kicker text-[19px]">{{ werkenBij.perksIntro.kicker }}</p>
          <h2 class="text-[28px] leading-[44px] tracking-[-0.025em]">
            {{ werkenBij.perksIntro.title }}
          </h2>
        </div>

        <div class="grid grid-cols-2 gap-3 desk:grid-cols-4">
          <div
            v-for="perk in werkenBij.perks"
            :key="perk.title"
            class="flex flex-col gap-5 rounded-tile border border-ink-900/10 p-3 md:p-6"
          >
            <img
              :src="`/img/feature-${perk.icon}.svg`"
              alt=""
              aria-hidden="true"
              class="block h-[50px] w-[50px] self-start object-contain object-left"
            >
            <div>
              <h3 class="mb-2.5 text-[16px] leading-[26px] tracking-[-0.01em] md:text-[19px]">
                {{ perk.title }}
              </h3>
              <p class="text-[13px] leading-[1.5] text-ink-600">{{ perk.body }}</p>
            </div>
          </div>
        </div>

        <p class="mt-4 text-center desk:mt-8">
          <NuxtLink
            :to="werkenBij.perksLink.to"
            class="border-b-[1.5px] border-ink-900 pb-[3px] font-display text-[15px] font-bold"
          >
            {{ werkenBij.perksLink.label }}&nbsp;&nbsp;→
          </NuxtLink>
        </p>
      </div>
    </section>

    <!--
      Requirements. All three cards carry a photo on the live site, so they line
      up on their own — the card is a 12px surface with a 12px inset frame
      around a 176px-tall crop.
    -->
    <section class="bg-white px-5 py-20 md:px-10">
      <div class="mx-auto max-w-[1200px]">
        <div class="mb-5 text-center">
          <p class="kicker">{{ werkenBij.requirementsIntro.kicker }}</p>
          <h2 class="text-[28px] leading-[44px] tracking-[-0.025em]">
            {{ werkenBij.requirementsIntro.title }}
          </h2>
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <article
            v-for="(requirement, index) in werkenBij.requirements"
            :key="requirement.title"
            class="flex flex-col gap-4 rounded-xl border border-ink-900/10 bg-white p-3"
          >
            <img
              :src="requirement.image"
              :alt="requirement.alt ?? ''"
              class="block h-[176px] w-full rounded-field object-cover object-center"
              loading="lazy"
            >
            <div class="flex flex-1 flex-col items-start gap-2 px-3 pb-3">
              <span
                class="mb-[5px] inline-block rounded-btn bg-accent-500 px-2.5 py-1 font-display text-[15px] font-bold text-ink-900"
              >
                {{ index + 1 }}.
              </span>
              <h3 class="text-[19px] leading-[20px] tracking-[-0.01em]">{{ requirement.title }}</h3>
              <p class="text-[15px] leading-[28px] text-ink-800 text-pretty">
                {{ requirement.body }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!--
      Apply. The live band runs on parchment and splits 34/66 with a 63px
      gutter — the copy column is the narrow one.
    -->
    <section
      id="solliciteren"
      class="scroll-mt-24 bg-parchment px-5 py-20 md:px-10"
    >
      <div
        class="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[34fr_66fr] md:gap-[63px]"
      >
        <div class="flex min-w-0 flex-col justify-center py-9">
          <p class="kicker text-[19px]">{{ werkenBij.apply.kicker }}</p>
          <h2 class="mb-1 text-[26px] leading-[1.2] tracking-[-0.03em] md:text-[32px] md:leading-[44px]">
            {{ werkenBij.apply.title }}
          </h2>
          <p class="max-w-[44ch] text-[14px] leading-[1.75] text-ink-600 text-pretty">
            {{ werkenBij.apply.body }}
          </p>

          <a
            :href="contact.applicationsEmailHref"
            class="mt-3 inline-flex items-center gap-3 self-start text-[17px] font-semibold text-ink-900 hover:text-accent-500"
          >
            <span
              class="inline-flex h-8 w-8 flex-none items-center justify-center rounded-field bg-accent-500/15 p-2"
            >
              <svg
                class="h-4 w-4 text-accent-500"
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
