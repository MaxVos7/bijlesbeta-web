<script setup lang="ts">
import { cookieConsent } from '~/data/site'

/**
 * The cookie banner, measured against bijlesbeta.nl's own: a full-width strip
 * on the page's warm ground, copy on the left and three pill buttons on the
 * right, stacking below 860px.
 *
 * Two things are deliberately not copied from the live site. It renders only
 * when a choice hasn't been made — the cookie is read during SSR, so there is
 * no flash of a banner the visitor already dismissed. And the pills are the
 * one place on the site that round past 8px, which is what the live banner
 * does; they don't belong to the `btn` scale.
 */
const { open, choose, restore } = useCookieConsent()

// A stored choice has to reach Consent Mode before Tag Manager acts on the
// defaults, so this runs as soon as the client picks up.
onMounted(restore)

/*
  Pills, not `btn` — the live banner is the one place on the site that rounds
  fully. Kept as constants rather than an `@apply` rule because a scoped block
  can't reach Tailwind's variants, and the rest of this app styles in the
  template anyway.
*/
const PILL
  = 'w-full cursor-pointer rounded-full px-4 py-2 text-center font-display '
    + 'text-[15px] leading-none font-semibold whitespace-nowrap transition md:w-auto'
const PILL_PLAIN
  = `${PILL} border-[1.5px] border-ink-900/15 bg-white text-ink-800 hover:border-ink-900/30 hover:bg-sand`
</script>

<template>
  <Transition
    enter-from-class="translate-y-full"
    enter-active-class="transition-transform duration-500 ease-out"
    leave-active-class="transition-transform duration-300 ease-in"
    leave-to-class="translate-y-full"
  >
    <div
      v-if="open"
      role="dialog"
      :aria-label="cookieConsent.ariaLabel"
      class="fixed inset-x-0 bottom-0 z-[999] border-t border-ink-900/10 bg-linen px-2.5 py-3.5 shadow-[0_-2px_40px_rgb(0_0_0_/_0.1)] md:px-12 md:py-[26px]"
    >
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-[60px]">
        <div class="min-w-0 md:flex-1">
          <p class="font-display text-[22px] leading-[1.15] font-extrabold tracking-[-0.01em] md:text-[26px]">
            {{ cookieConsent.title }}
          </p>
          <p class="mt-2 font-display text-[14px] leading-[1.55] text-ink-700">
            {{ cookieConsent.body }}
            <NuxtLink
              :to="cookieConsent.policyTo"
              class="text-accent-500 underline decoration-accent-500/40 underline-offset-2 hover:decoration-accent-500/70"
            >
              {{ cookieConsent.policyLabel }}
            </NuxtLink>
          </p>
        </div>

        <!-- Least permissive first, as on the live banner. -->
        <div class="flex flex-none flex-col gap-3 md:flex-row md:items-center">
          <button type="button" :class="PILL_PLAIN" @click="choose('deny')">
            {{ cookieConsent.deny }}
          </button>
          <button type="button" :class="PILL_PLAIN" @click="choose('analytics')">
            {{ cookieConsent.analytics }}
          </button>
          <button
            type="button"
            :class="[PILL, 'bg-brand-500 font-bold text-ink-800 hover:bg-brand-600']"
            @click="choose('accept')"
          >
            {{ cookieConsent.accept }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
