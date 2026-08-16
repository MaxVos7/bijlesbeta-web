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
      <h2 class="text-[28px] leading-[44px] tracking-[-0.025em] text-balance">
        Waarom onze leerlingen zo tevreden zijn?
      </h2>
    </div>

    <div
      class="grid gap-[clamp(14px,1.8vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]"
    >
      <div
        v-for="feature in features"
        :key="feature.title"
        class="flex flex-col gap-3 rounded-tile border border-line-ink px-6 py-[26px]"
      >
        <!-- The drawings carry the brand amber themselves, so they sit on the
             card ground rather than in an amber tile. -->
        <img
          :src="`/img/feature-${feature.icon}.svg`"
          alt=""
          aria-hidden="true"
          class="block h-[46px] w-auto self-start"
        >
        <!-- These four are Elementor icon-boxes on the live site, and are the
             one card type that steps down below 768px: 19px/26px title, 16px
             under `md`, over a 13px description. -->
        <h3 class="mt-2 text-[16px] leading-[26px] tracking-[-0.01em] md:text-[19px]">
          {{ feature.title }}
        </h3>
        <p class="text-[13px] leading-[1.5] text-ink-600">{{ feature.body }}</p>
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
