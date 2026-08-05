<script setup lang="ts">
import { nav } from '~/data/site'

withDefaults(
  defineProps<{
    /**
     * Drops the cream ground so the white bar can float over the landing
     * pages' dark photographic hero. Not sticky in this variant — a bar with
     * no ground of its own would carry the hero's transparency over the white
     * sections below it.
     */
    transparent?: boolean
  }>(),
  { transparent: false },
)

const config = useRuntimeConfig()
</script>

<template>
  <!--
    The bar floats as a white card on the cream ground. The nav has no mobile
    menu by design: it stays inline and wraps to a second row on narrow
    screens, which clears a 360px phone without overflowing.
  -->
  <div
    class="px-[clamp(12px,3vw,24px)] py-[clamp(10px,1.4vw,18px)]"
    :class="transparent ? 'relative z-10' : 'sticky top-0 z-50 bg-cream'"
  >
    <header
      class="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-[clamp(16px,2vw,24px)] gap-y-3 rounded-card bg-white px-[clamp(14px,2vw,22px)] py-3 shadow-header"
    >
      <NuxtLink to="/" class="flex items-center" aria-label="Bijles Bèta — naar de homepage">
        <img
          src="/logo.svg"
          alt="Bijles Bèta"
          class="block h-[clamp(34px,3.2vw,44px)] w-auto"
          width="142"
          height="56"
        >
      </NuxtLink>

      <nav
        class="flex min-w-[255px] flex-1 flex-wrap justify-center gap-x-[clamp(16px,2.2vw,28px)] gap-y-2 text-[15px] font-medium"
        aria-label="Hoofdmenu"
      >
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="transition hover:text-brand-700"
          active-class="text-brand-700"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2.5">
        <NuxtLink to="/aanmelden" class="btn-primary">Gratis proefles</NuxtLink>
        <a
          :href="config.public.portalUrl"
          class="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-btn border border-line-300 transition hover:bg-cream"
          aria-label="Inloggen"
        >
          <svg
            class="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
          </svg>
        </a>
      </div>
    </header>
  </div>
</template>
