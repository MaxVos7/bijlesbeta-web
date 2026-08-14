<script setup lang="ts">
import { comparison } from '~/data/site'

/**
 * "De verschillen op een rij" — Bijles Bèta beside the regular providers, with
 * the amber VS badge straddling the two cards. Shared by Over ons and Zo werkt
 * het.
 */
</script>

<template>
  <section
    class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(30px,4vw,50px)] pb-[clamp(56px,7vw,90px)]"
  >
    <div class="mx-auto max-w-[1100px]">
      <div class="mb-[clamp(28px,3.5vw,44px)] text-center">
        <p class="kicker mb-2.5">{{ comparison.kicker }}</p>
        <h2 class="text-[clamp(24px,2.9vw,28px)] tracking-[-0.025em]">{{ comparison.title }}</h2>
      </div>

      <div
        class="relative mx-auto grid max-w-[840px] gap-[clamp(14px,2vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
      >
        <div class="overflow-hidden rounded-tile border border-line-200 bg-white">
          <div class="bg-sand px-6 py-[26px] text-center">
            <span
              class="mb-3.5 inline-flex h-[38px] w-[38px] items-center justify-center rounded-btn bg-ink-900 text-lg font-extrabold text-brand-500"
              aria-hidden="true"
            >B</span>
            <h3 class="mb-2 text-[17px]">{{ comparison.us.title }}</h3>
            <p class="text-[13px] leading-[1.55] text-ink-600">{{ comparison.us.body }}</p>
          </div>
          <ul class="m-0 list-none px-[22px] pt-2 pb-[22px]">
            <li
              v-for="point in comparison.us.points"
              :key="point"
              class="flex items-start gap-3 border-b border-line-100 py-3.5 text-[13px] leading-normal last:border-b-0"
            >
              <svg
                class="mt-0.5 h-3.5 w-3.5 flex-none text-success-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3.4"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M4 12l6 6L20 6" />
              </svg>
              {{ point }}
            </li>
          </ul>
        </div>

        <div class="overflow-hidden rounded-tile border border-line-200 bg-white">
          <div class="bg-sand px-6 py-[26px] text-center">
            <span class="mb-3.5 inline-flex h-[38px] w-[38px] items-center justify-center">
              <svg
                class="h-[26px] w-[26px] text-ink-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path
                  d="M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16M15 10h4a1 1 0 011 1v10M3 21h18M7 8h2M7 12h2M7 16h2M18 14h.01M18 18h.01"
                />
              </svg>
            </span>
            <h3 class="mb-2 text-[17px]">{{ comparison.them.title }}</h3>
            <p class="text-[13px] leading-[1.55] text-ink-600">{{ comparison.them.body }}</p>
          </div>
          <ul class="m-0 list-none px-[22px] pt-2 pb-[22px]">
            <li
              v-for="point in comparison.them.points"
              :key="point"
              class="flex items-start gap-3 border-b border-line-100 py-3.5 text-[13px] leading-normal last:border-b-0"
            >
              <svg
                class="mt-0.5 h-3.5 w-3.5 flex-none text-danger"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3.4"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
              {{ point }}
            </li>
          </ul>
        </div>

        <span
          class="pointer-events-none absolute top-[38%] left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-500 text-[15px] font-extrabold shadow-[0_6px_18px_rgb(255_187_0_/_0.4)]"
          aria-hidden="true"
        >VS</span>
      </div>
    </div>
  </section>
</template>
