<script setup lang="ts">
import { mijnNav } from '~/data/mijn'

/*
  The logged-in shell: the site's floating header card at the same size as
  `SiteHeader` — same strip, same 1400px card, same logo and nav type at each
  breakpoint — but with the account's own links instead of the marketing nav,
  and no footer. Links appear here as their pages are ported from the app.
*/
const { user, logout } = useMijnSession()
const pending = ref(false)

/** Each account sees the pages its role has. */
const nav = computed(() => {
  if (!user.value) return []

  if (user.value.is_customer) {
    return [
      { to: '/mijn/overzicht/', label: mijnNav.overview },
      { to: '/mijn/lessen/', label: mijnNav.lessons },
      { to: '/mijn/leerlingen/', label: mijnNav.children },
      { to: '/mijn/pakket/', label: mijnNav.package },
      { to: '/mijn/facturen/', label: mijnNav.invoices },
    ]
  }

  return [{ to: '/mijn/lessen/', label: mijnNav.lessons }]
})

async function onLogout() {
  pending.value = true
  try {
    await logout()
  }
  finally {
    pending.value = false
    await navigateTo('/mijn/inloggen/')
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <div class="sticky top-0 z-50 px-5 pt-4 pb-4 md:px-10 md:pt-10 md:pb-6">
      <header
        class="mx-auto flex w-full max-w-[1400px] flex-row items-center justify-between gap-6 rounded-[12px] bg-white px-6 py-4 shadow-panel"
      >
        <NuxtLink to="/" class="block flex-none" aria-label="Bijles Bèta — naar de homepage">
          <img
            src="/logo.svg"
            alt="Bijles Bèta"
            class="block h-[28px] w-[71px] object-cover object-center md:h-[35px] md:w-[95px] desk:h-[56px] desk:w-[142px]"
            width="142"
            height="56"
          >
        </NuxtLink>

        <nav
          v-if="user"
          class="flex flex-1 flex-wrap items-center gap-x-[14px] desk:gap-x-0"
          aria-label="Mijn Bijles Bèta"
        >
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="font-display text-[13px] leading-normal font-bold text-ink-900 transition-colors duration-300 hover:text-brand-500 desk:px-4 desk:py-2 desk:text-[15px]"
            active-class="text-brand-500"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Sized like the header's "Gratis proefles" button, in the secondary style. -->
        <button
          v-if="user"
          type="button"
          class="inline-block flex-none rounded-[4px] border border-black/10 bg-white px-3 py-2.5 font-display text-[12px] leading-[11px] font-bold whitespace-nowrap text-ink-900 transition duration-300 hover:bg-linen disabled:opacity-60 md:px-2 md:py-3 md:text-[13px] desk:px-5 desk:py-4 desk:text-[15px]"
          :disabled="pending"
          @click="onLogout"
        >
          {{ mijnNav.logout }}
        </button>
      </header>
    </div>

    <!--
      `data-ph-mask` masks every text node below it in PostHog session replay
      (inputs are masked sitewide already). These pages show students' names
      and lesson details, none of which belongs in a recording.
    -->
    <main class="flex-1 pt-4 pb-16 md:pt-6" data-ph-mask>
      <slot />
    </main>
  </div>
</template>
