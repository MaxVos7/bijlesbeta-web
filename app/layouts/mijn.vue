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
const route = useRoute()

/** Mobile dropdown, as in `SiteHeader`; closes on navigation. */
const menuOpen = ref(false)
watch(() => route.fullPath, () => {
  menuOpen.value = false
})

/** Each account sees the pages its role has. */
const nav = computed(() => {
  // Until the temporary password is replaced there is nowhere else to go.
  if (!user.value || user.value.must_change_password) return []

  if (user.value.is_customer) {
    return [
      { to: '/mijn/overzicht/', label: mijnNav.overview },
      { to: '/mijn/lessen/', label: mijnNav.lessons },
      { to: '/mijn/leerlingen/', label: mijnNav.children },
      { to: '/mijn/pakket/', label: mijnNav.package },
      // Customers on an old-style subscription never see the new system.
      ...(user.value.package_periods ? [{ to: '/mijn/pakketten/', label: mijnNav.packageNew }] : []),
      { to: '/mijn/facturen/', label: mijnNav.invoices },
      { to: '/mijn/profiel/', label: mijnNav.profile },
    ]
  }

  return [
    { to: '/mijn/lessen/', label: mijnNav.lessons },
    { to: '/mijn/profiel/', label: mijnNav.profile },
  ]
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
        class="relative mx-auto flex w-full max-w-[1400px] flex-row items-center justify-between gap-3 rounded-[12px] bg-white px-6 py-4 shadow-panel md:gap-6"
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
          class="hidden flex-1 flex-wrap items-center md:flex gap-x-[14px] desk:gap-x-0"
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

        <div class="ml-auto flex flex-none flex-row items-center gap-3 md:ml-0">
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

          <button
            v-if="user && nav.length"
            type="button"
            class="flex h-[38px] w-[42px] flex-none items-center justify-center rounded-[4px] border border-[rgba(29,29,27,0.1)] bg-white md:hidden"
            :aria-label="menuOpen ? 'Menu sluiten' : 'Menu openen'"
            :aria-expanded="menuOpen"
            aria-controls="mijn-menu-mobiel"
            @click="menuOpen = !menuOpen"
          >
            <svg
              v-if="menuOpen"
              class="h-[20px] w-[20px] fill-ink-900"
              viewBox="0 0 1000 1000"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z" />
            </svg>
            <svg
              v-else
              class="w-[24px]"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M2 2H20" stroke="#1D1D1B" stroke-width="3" stroke-linecap="round" />
              <path d="M2 9H20" stroke="#1D1D1B" stroke-width="3" stroke-linecap="round" />
              <path d="M2 16H15" stroke="#1D1D1B" stroke-width="3" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <!-- Mobile dropdown: same geometry as `SiteHeader`'s. -->
        <nav
          v-if="menuOpen && nav.length"
          id="mijn-menu-mobiel"
          class="absolute inset-x-0 top-[calc(100%-13px)] rounded-b-[12px] bg-white shadow-panel md:hidden"
          aria-label="Mijn Bijles Bèta"
        >
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="block p-3 font-display text-[13px] leading-normal font-bold text-ink-900 transition-colors duration-300 last:rounded-b-[12px] hover:text-brand-500"
            active-class="text-brand-500"
            @click="menuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
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
