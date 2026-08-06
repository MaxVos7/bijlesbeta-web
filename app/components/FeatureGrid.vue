<script setup lang="ts">
import { features } from '~/data/site'

/**
 * "Waarom onze leerlingen zo tevreden zijn?" — the four reasons, shared by the
 * homepage and the subject landing pages.
 *
 * Renders the heading, grid and closing link only; the page supplies the
 * <section> around it so each can set its own ground and vertical rhythm.
 */
</script>

<template>
  <div>
    <div class="mb-[clamp(30px,4vw,46px)] text-center">
      <p class="kicker mb-2.5">De B van Bijles, Bèta, Bekwaamheid en Begrip</p>
      <h2 class="text-[clamp(24px,2.8vw,32px)] tracking-[-0.025em] text-balance">
        Waarom onze leerlingen zo tevreden zijn?
      </h2>
    </div>

    <div
      class="grid gap-[clamp(14px,1.8vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]"
    >
      <div
        v-for="feature in features"
        :key="feature.title"
        class="flex flex-col gap-3 rounded-tile border border-line-200 px-6 py-[26px] transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_28px_rgb(31_29_28_/_0.08)]"
      >
        <span class="flex h-[52px] w-[52px] items-center justify-center rounded-panel bg-brand-100">
          <svg
            class="h-[26px] w-[26px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <template v-if="feature.icon === 'board'">
              <path d="M3 4h18v10H3z" /><path d="M12 14v6M9 20h6M2 4h20" />
            </template>
            <template v-else-if="feature.icon === 'team'">
              <circle cx="9" cy="8" r="4" />
              <path
                d="M2 21c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16 4.5a4 4 0 010 7.5M18.5 21c0-2.6-1-4.3-2.5-5.3"
              />
            </template>
            <template v-else-if="feature.icon === 'clock'">
              <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" />
            </template>
            <template v-else>
              <ellipse cx="12" cy="6" rx="8" ry="3" />
              <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
            </template>
          </svg>
        </span>
        <h3 class="mt-2 text-[17px] tracking-[-0.01em]">{{ feature.title }}</h3>
        <p class="text-[15px] leading-[1.62] text-ink-600">{{ feature.body }}</p>
      </div>
    </div>

    <p class="mt-[clamp(32px,4vw,48px)] text-center">
      <NuxtLink
        to="/over-ons"
        class="border-b-[1.5px] border-ink-900 pb-[3px] text-[15px] font-semibold"
      >
        Lees meer over ons&nbsp;&nbsp;→
      </NuxtLink>
    </p>
  </div>
</template>
