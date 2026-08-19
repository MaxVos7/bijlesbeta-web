<script setup lang="ts">
import { nav, subjectCards, subjectMenu } from '~/data/site'
import { landingPath } from '~/data/landings'

withDefaults(
  defineProps<{
    /**
     * Drops the sticky behaviour so the bar sits in flow over the landing
     * pages' dark photographic hero rather than following the scroll.
     */
    transparent?: boolean
  }>(),
  { transparent: false },
)

const route = useRoute()
const config = useRuntimeConfig()

/*
  The strip around the floating bar carries no ground of its own: on the live
  site the bar hovers and the page runs up behind it, so whatever band the
  page opens on is what shows. The one exception is a page whose hero opens on
  the dark band while the bar is still in flow — it sets
  `definePageMeta({ headerGround: 'ink' })` so the strip continues the band
  rather than cutting a pale line above it.
*/
const groundClass = computed(() =>
  route.meta.headerGround === 'ink' ? 'bg-ink-900' : '',
)

/*
  The bar mirrors bijlesbeta.nl's Elementor header exactly, including its
  breakpoints, which are Elementor's rather than Tailwind's:

    mobile   ≤ 767px   logo · CTA · hamburger, nav in a dropdown
    tablet   768–1024   full nav, smaller everything, no portal icon
    desktop  ≥ 1025px   full nav at rest size, portal icon

  Tailwind's `md:` lines up with the tablet floor at 768px; the desktop floor
  needs `desk:` because `lg:` starts one pixel early, at 1024.

  The three columns are laid out on percentage widths, again as on the live
  site — 20/53/25 on desktop, 14/64/19 on tablet, 30/43/13 on mobile, where
  the actions column is reordered to sit before the menu toggle.
*/
const menuOpen = ref(false)

/*
  `Home` carries the subject mega-menu — the Beeldbanner variant of the three
  the handoff offered: three photo columns over a linen strip, the full width
  of the header card. It opens on hover *and* on focus, so it is reachable
  from the keyboard rather than being a pointer-only disclosure; the header's
  own mouseleave and Escape close it again.

  It exists from the tablet floor up, because that is where the horizontal nav
  that triggers it exists. Below 768px `Home` is an ordinary row in the mobile
  dropdown.
*/
const subjectsOpen = ref(false)

watch(() => route.fullPath, () => {
  menuOpen.value = false
  subjectsOpen.value = false
})
</script>

<template>
  <div
    class="px-5 pt-4 pb-4 md:px-10 md:pt-10 md:pb-6"
    :class="transparent ? 'relative z-10' : ['sticky top-0 z-50', groundClass]"
  >
    <header
      class="relative mx-auto flex w-full max-w-[1400px] flex-row items-center justify-between gap-3 rounded-[12px] bg-white px-6 py-4 shadow-panel md:items-stretch"
      @mouseleave="subjectsOpen = false"
      @keydown.escape="subjectsOpen = false"
    >
      <!-- Logo column -->
      <div class="order-1 flex w-[30%] flex-none flex-col justify-center md:w-[14%] desk:w-[20%]">
        <NuxtLink to="/" class="block" aria-label="Bijles Bèta — naar de homepage">
          <img
            src="/logo.svg"
            alt="Bijles Bèta"
            class="block h-[28px] w-[71px] object-cover object-center md:h-[35px] md:w-[95px] desk:h-[56px] desk:w-[142px]"
            width="142"
            height="56"
          >
        </NuxtLink>
      </div>

      <!--
        Menu column. Holds the horizontal nav from 768px up and the toggle
        below it; on mobile it is ordered last, after the actions.
      -->
      <div
        class="order-3 flex w-[13%] flex-none flex-row items-center justify-center md:order-2 md:w-[64%] desk:w-[53%] desk:flex-col desk:items-end"
      >
        <nav
          class="hidden flex-wrap items-center gap-x-[14px] md:flex desk:gap-x-0"
          aria-label="Hoofdmenu"
        >
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-[7px] font-display text-[13px] leading-normal font-bold transition-colors duration-300 hover:text-brand-500 desk:px-4 desk:py-2 desk:text-[15px]"
            :class="subjectsOpen ? 'text-brand-500' : 'text-ink-900'"
            active-class="text-brand-500"
            aria-haspopup="true"
            :aria-expanded="subjectsOpen"
            aria-controls="vakkenmenu"
            @mouseenter="subjectsOpen = true"
            @focus="subjectsOpen = true"
          >
            {{ subjectMenu.label }}
            <svg width="11" height="7" viewBox="0 0 12 8" fill="none" aria-hidden="true">
              <path
                d="M1.5 1.5L6 6L10.5 1.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </NuxtLink>

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

        <button
          type="button"
          class="flex h-[38px] w-[42px] items-center justify-center rounded-[4px] border border-[rgba(29,29,27,0.1)] bg-white md:hidden"
          :aria-label="menuOpen ? 'Menu sluiten' : 'Menu openen'"
          :aria-expanded="menuOpen"
          aria-controls="hoofdmenu-mobiel"
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

      <!-- Actions column -->
      <div
        class="order-2 flex w-[43%] flex-none flex-row items-center justify-end gap-3 md:order-3 md:w-[19%] desk:w-[25%]"
      >
        <NuxtLink
          to="/aanmelden"
          class="inline-block rounded-[4px] bg-brand-500 px-3 py-2.5 font-display text-[12px] leading-[11px] font-bold whitespace-nowrap text-ink-900 transition duration-300 hover:bg-ink-900 hover:text-white md:px-2 md:py-3 md:text-[13px] desk:px-5 desk:py-4 desk:text-[15px]"
        >
          Gratis proefles
        </NuxtLink>

        <!-- Portal login. Desktop only, as on the live site. -->
        <a
          :href="`${config.public.portalUrl}/login`"
          class="hidden flex-none desk:block"
          aria-label="Inloggen op Mijn Bijles Bèta"
        >
          <!-- 43×43 on a 0 0 43 44 box, exactly as Elementor squashes it. -->
          <svg
            width="43"
            height="43"
            viewBox="0 0 43 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="0.5" y="1" width="42" height="42" rx="3.5" stroke="#1D1D1B" stroke-opacity="0.15" />
            <circle cx="21.5001" cy="18.4298" r="3.49421" stroke="#1D1D1B" stroke-width="1.5" stroke-linecap="round" />
            <path
              d="M27.9637 29.0645C27.9637 25.0906 26.7246 21.924 21.5004 21.924C16.2761 21.924 15.0371 24.9399 15.0371 29.0645"
              stroke="#1D1D1B"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </a>
      </div>

      <!--
        The panel spans the card because it hangs off the card, not off the
        `Home` label: it repeats the header's own 12px radius and `shadow-panel`
        and sits 10px below it. `overflow-hidden` is what clips the three
        photographs and the linen strip to that radius.
      -->
      <div
        v-if="subjectsOpen"
        id="vakkenmenu"
        class="absolute inset-x-0 top-[calc(100%+10px)] z-[60] overflow-hidden rounded-block bg-white shadow-panel"
      >
        <div class="grid grid-cols-3">
          <NuxtLink
            v-for="(subject, index) in subjectCards"
            :key="subject.slug"
            :to="landingPath(subject.slug)"
            class="flex flex-col text-ink-800 transition-colors duration-200 hover:bg-linen"
            :class="index < subjectCards.length - 1 && 'border-r border-line-ink'"
            @click="subjectsOpen = false"
          >
            <img
              :src="subject.image"
              alt=""
              aria-hidden="true"
              class="block h-[150px] w-full object-cover"
              loading="lazy"
            >
            <span class="flex flex-col gap-2 p-6">
              <span class="flex items-baseline gap-2.5">
                <span class="font-display text-[19px] font-bold tracking-[-0.02em]">
                  {{ subject.name }}
                </span>
                <!-- The level tag rides the subject name on the baseline, in
                     the accent amber rather than the ink. -->
                <span class="font-display text-[13px] font-bold text-accent-500">
                  {{ subject.tag }}
                </span>
              </span>
              <span class="text-[13.5px] leading-[1.6] text-ink-600">{{ subject.menuBody }}</span>
              <span class="font-display text-[13px] font-bold text-brand-700">
                {{ subjectMenu.cardCta }}
              </span>
            </span>
          </NuxtLink>
        </div>

        <div
          class="flex flex-wrap items-center justify-between gap-4 bg-linen px-6 py-[18px]"
        >
          <p class="text-[14px] text-ink-600">{{ subjectMenu.note }}</p>
          <NuxtLink
            :to="subjectMenu.link.to"
            class="border-b-[1.5px] border-ink-900 pb-[3px] text-[15px] font-semibold"
            @click="subjectsOpen = false"
          >
            {{ subjectMenu.link.label }}&nbsp;&nbsp;→
          </NuxtLink>
        </div>
      </div>

      <!--
        The mobile dropdown overlays the page rather than pushing it, and
        starts 13px above the card's bottom edge so its white runs into the
        card's without a seam — the live site's geometry.
      -->
      <nav
        v-if="menuOpen"
        id="hoofdmenu-mobiel"
        class="absolute inset-x-0 top-[calc(100%-13px)] rounded-b-[12px] bg-white shadow-panel md:hidden"
        aria-label="Hoofdmenu"
      >
        <!-- No mega-menu here — below 768px `Home` is just the first row. -->
        <NuxtLink
          to="/"
          class="block p-3 font-display text-[13px] leading-normal font-bold text-ink-900 transition-colors duration-300 hover:text-brand-500"
          active-class="text-brand-500"
          @click="menuOpen = false"
        >
          {{ subjectMenu.label }}
        </NuxtLink>
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
</template>
