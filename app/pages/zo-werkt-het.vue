<script setup lang="ts">
import { heroPromises, reassurance, zoWerktHet } from '~/data/site'

useSeoMeta({
  title: 'Zo werkt het',
  description:
    'Van aanmelding tot de eerste bijles in vier stappen: meld je aan, wij zoeken de juiste docent, jullie leren elkaar kennen tijdens de gratis proefles en daarna gaan de bijlessen van start.',
})
</script>

<template>
  <div>
    <section
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
            {{ zoWerktHet.title }}
          </h1>
          <p class="mb-7 max-w-[46ch] text-[clamp(15px,1.2vw,17px)] leading-relaxed text-ink-600">
            {{ zoWerktHet.intro }}
          </p>

          <CheckList :items="heroPromises" class="mb-8" />

          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/aanmelden"
              class="btn-primary gap-3.5 px-[26px] py-4 text-base shadow-[0_6px_18px_rgb(255_187_0_/_0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgb(255_187_0_/_0.42)]"
            >
              Gratis proefles <span class="text-lg" aria-hidden="true">→</span>
            </NuxtLink>
            <a
              href="#stappenplan"
              class="btn-secondary gap-3.5 px-6 py-4 text-base hover:border-brand-500 hover:bg-ivory"
            >
              {{ zoWerktHet.secondaryCta }} <span class="text-lg" aria-hidden="true">→</span>
            </a>
          </div>
          <p class="mt-3.5 text-[13px] text-ink-400">{{ reassurance }}</p>
        </div>

        <div class="min-w-0">
          <img
            src="/img/fiets.png"
            alt="Docent op de fiets in Groningen"
            class="mx-auto block aspect-[3/4] w-full max-w-[420px] rounded object-cover"
          >
        </div>
      </div>
    </section>

    <section
      id="stappenplan"
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(48px,6vw,80px)] pb-[clamp(40px,5vw,64px)]"
    >
      <div class="mx-auto max-w-[1180px]">
        <div class="mb-[clamp(28px,3.5vw,42px)] text-center">
          <p class="kicker mb-2">{{ zoWerktHet.stepsIntro.kicker }}</p>
          <h2 class="text-[clamp(24px,2.8vw,32px)] tracking-[-0.025em]">
            {{ zoWerktHet.stepsIntro.title }}
          </h2>
        </div>

        <div
          class="grid gap-[clamp(16px,2vw,24px)] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]"
        >
          <article
            v-for="step in zoWerktHet.steps"
            :key="step.title"
            class="flex flex-col rounded-tile border border-line-200 px-[22px] pt-[22px] pb-[26px] transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_16px_34px_rgb(31_29_28_/_0.10)]"
          >
            <span class="mb-[22px] flex h-10 w-10 items-center justify-center">
              <svg
                class="h-8 w-8 text-brand-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <template v-if="step.icon === 'form'">
                  <path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h8" />
                  <path d="M14 3l5 4v14h-5z" />
                  <path d="M9 12h.01" />
                </template>
                <template v-else-if="step.icon === 'match'">
                  <path d="M4 14v-3a8 8 0 0116 0v3" />
                  <path d="M4 14h2.5a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
                  <path d="M20 14h-2.5a1 1 0 00-1 1v3a1 1 0 001 1H19a1 1 0 001-1z" />
                  <path d="M9 21h6" />
                </template>
                <template v-else-if="step.icon === 'trial'">
                  <path d="M3 9l9 4 9-4" />
                  <path d="M3 9v9l9 4 9-4V9" />
                  <path d="M7 4l5 5 5-5" />
                </template>
                <template v-else>
                  <path d="M3 4h18v11H3z" />
                  <path d="M12 15v6" />
                  <path d="M9 21h6" />
                  <path d="M8 8h6M8 11h4" />
                </template>
              </svg>
            </span>
            <h3 class="mb-2.5 text-[17px] tracking-[-0.01em]">{{ step.title }}</h3>
            <p class="text-[13px] leading-[1.7] text-ink-700">{{ step.body }}</p>
          </article>
        </div>

        <p class="mt-[clamp(32px,4vw,48px)] text-center">
          <NuxtLink
            :to="zoWerktHet.stepsLink.to"
            class="border-b-[1.5px] border-ink-900 pb-[3px] text-[15px] font-semibold"
          >
            {{ zoWerktHet.stepsLink.label }}&nbsp;&nbsp;→
          </NuxtLink>
        </p>
      </div>
    </section>

    <ComparisonTable />

    <TrialCta />

    <FaqSection />
  </div>
</template>
