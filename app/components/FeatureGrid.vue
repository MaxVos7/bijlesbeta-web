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
        <!-- The drawings carry the brand amber themselves, so they sit on the
             card ground rather than in an amber tile. -->
        <img
          :src="`/img/feature-${feature.icon}.svg`"
          alt=""
          aria-hidden="true"
          class="block h-[46px] w-auto self-start"
        >
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
