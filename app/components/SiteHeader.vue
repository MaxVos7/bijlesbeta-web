<script setup lang="ts">
import { nav } from '~/data/site'

const open = ref(false)
const route = useRoute()
const config = useRuntimeConfig()

watch(() => route.fullPath, () => {
  open.value = false
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="container-page flex h-16 items-center justify-between gap-4">
      <NuxtLink to="/" class="text-lg font-bold tracking-tight text-brand-700">
        Bijles Bèta
      </NuxtLink>

      <nav class="hidden items-center gap-6 md:flex" aria-label="Hoofdmenu">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="text-sm font-medium text-slate-600 transition hover:text-brand-700"
          active-class="text-brand-700"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hidden items-center gap-3 md:flex">
        <a
          :href="config.public.portalUrl"
          class="text-sm font-medium text-slate-600 transition hover:text-brand-700"
        >
          Inloggen
        </a>
        <NuxtLink to="/aanmelden" class="btn-primary">Gratis proefles</NuxtLink>
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 md:hidden"
        :aria-expanded="open"
        aria-controls="mobile-menu"
        aria-label="Menu openen"
        @click="open = !open"
      >
        <span class="sr-only">Menu</span>
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            :d="open ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'"
          />
        </svg>
      </button>
    </div>

    <div v-if="open" id="mobile-menu" class="border-t border-slate-200 bg-white md:hidden">
      <nav class="container-page flex flex-col gap-1 py-4" aria-label="Mobiel menu">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {{ item.label }}
        </NuxtLink>
        <a
          :href="config.public.portalUrl"
          class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Inloggen
        </a>
        <NuxtLink to="/aanmelden" class="btn-primary mt-2">Gratis proefles</NuxtLink>
      </nav>
    </div>
  </header>
</template>
