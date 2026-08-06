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
const route = useRoute()

// Pages opening on the dark hero band darken the strip too, via
// `definePageMeta({ headerGround: 'ink' })`. Everything else stays on cream.
const groundClass = computed(() =>
  route.meta.headerGround === 'ink' ? 'bg-ink-900' : 'bg-cream',
)

/*
  Below 768px (Tailwind's `md`) the five nav items collapse behind a hamburger.
  Which half shows is decided in CSS rather than from a media query in script,
  so the right one renders on the server; only the open/closed state needs
  JavaScript.
*/
const menuOpen = ref(false)

watch(() => route.fullPath, () => {
  menuOpen.value = false
})
</script>

<template>
  <!--
    The bar floats as a white card on the cream ground: a single row up to the
    breakpoint's width, with the collapsed menu opening underneath it.
  -->
  <div
    class="px-[clamp(12px,3vw,24px)] py-[clamp(10px,1.4vw,18px)]"
    :class="transparent ? 'relative z-10' : ['sticky top-0 z-50', groundClass]"
  >
    <header
      class="mx-auto flex max-w-[1180px] flex-col rounded-card bg-white px-[clamp(14px,2vw,22px)] py-3 shadow-header"
    >
      <div class="flex flex-wrap items-center justify-between gap-x-[clamp(16px,2vw,24px)] gap-y-3">
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
          class="hidden min-w-[255px] flex-1 flex-wrap justify-center gap-x-[clamp(16px,2.2vw,28px)] gap-y-2 text-[15px] font-medium md:flex"
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
            class="hidden h-[42px] w-[42px] flex-none items-center justify-center rounded-btn border border-line-300 transition hover:bg-cream md:flex"
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

          <button
            type="button"
            class="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-btn border border-line-300 bg-white transition hover:bg-cream md:hidden"
            :aria-label="menuOpen ? 'Menu sluiten' : 'Menu openen'"
            :aria-expanded="menuOpen"
            aria-controls="hoofdmenu-mobiel"
            @click="menuOpen = !menuOpen"
          >
            <svg
              v-if="menuOpen"
              class="h-[22px] w-[22px] text-ink-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            <svg
              v-else
              class="h-[22px] w-[22px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M5 7h14M5 12h14M5 17h14" />
            </svg>
          </button>
        </div>
      </div>

      <nav
        v-if="menuOpen"
        id="hoofdmenu-mobiel"
        class="mt-3.5 flex flex-col font-display text-[19px] font-bold md:hidden"
        aria-label="Hoofdmenu"
      >
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex min-h-[56px] items-center border-b border-line-100 py-2 transition hover:text-brand-700"
          active-class="text-brand-700"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </header>
  </div>
</template>
