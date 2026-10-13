<script setup lang="ts">
import { actieEnd, actieUtrecht as page } from '~/data/actie-utrecht'
import { freeWeekBenefit, openingsactieUtrecht } from '~/data/openingsactie-utrecht'
import { contact, cookieConsent } from '~/data/site'

/**
 * The compact Utrecht campaign page, from the Claude Design handoff
 * `Openingsactie Utrecht v3.dc.html` — one narrow column that goes straight
 * from the offer to the form, for ad traffic on a phone. The handoff's hero
 * video is deliberately left out.
 *
 * The form is `LeadForm`, not the handoff's own: the design ends in a
 * "Gelukt!" message, but the proefles block hands the visitor to the wizard
 * rather than thanking them — see "The proefles block" in CLAUDE.md.
 *
 * Below the form it borrows the reviews, the packages, the stappenplan, the
 * FAQ and the phone sticky bar from `/openingsactie-utrecht/`, with that
 * page's copy, so the two campaign pages can't drift apart on them. The
 * proefles card (`ActieClaimCard`) comes back once more before the FAQ.
 *
 * Out of the index and out of the sitemap, like `/openingsactie-utrecht/`.
 */
definePageMeta({ layout: 'bare' })

useSeo({
  title: page.seoTitle,
  description: page.seoDescription,
})
useHead({ meta: [{ name: 'robots', content: 'noindex, follow' }] })

const analytics = useAnalytics()
const route = useRoute()
const vak = useVak()
const { reopen, level, open: consentOpen } = useCookieConsent()

/*
  The phone-only bar at the foot of the screen. It only appears once the
  visitor has scrolled past the first form — from the reviews down — since
  above it the form itself is the call to action, and it steps aside while
  the second form is on screen, where it would only cover what it points at.
  Like on `/openingsactie-utrecht/`, it never shares the screen with the
  cookie banner, which also sits on the bottom edge.
*/
const pastForm = ref(false)
const secondFormInView = ref(false)
const showBar = computed(
  () => level.value !== null && !consentOpen.value && pastForm.value && !secondFormInView.value,
)

let observer: IntersectionObserver | undefined

const formatPrice = (value: number) => `€${value}`

/*
  The countdown only runs in the browser. Rendered on the server it would be
  stale by the time it hydrated, and the mismatch would replace it anyway, so
  the banner shows the plain end date until the clock is mounted.
*/
const countdown = ref<string>()
let timer: ReturnType<typeof setInterval> | undefined

function tick() {
  let diff = Math.max(0, new Date(actieEnd).getTime() - Date.now())
  const d = Math.floor(diff / 864e5)
  diff -= d * 864e5
  const pad = (n: number) => String(n).padStart(2, '0')
  const h = Math.floor(diff / 36e5)
  const m = Math.floor((diff % 36e5) / 6e4)
  const s = Math.floor((diff % 6e4) / 1e3)
  countdown.value = page.countdown(d, `${pad(h)}:${pad(m)}:${pad(s)}`)
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)

  const first = document.getElementById('proefles')
  const second = document.getElementById('proefles-onder')
  if (!first || !('IntersectionObserver' in window)) return
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === first) pastForm.value = !entry.isIntersecting && entry.boundingClientRect.top < 0
      else secondFormInView.value = entry.isIntersecting
    }
  })
  observer.observe(first)
  if (second) observer.observe(second)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  observer?.disconnect()
})
</script>

<template>
  <div class="flex min-h-screen flex-col items-center bg-white">
    <p class="w-full bg-brand-500 px-4 py-2.5 text-center font-display text-sm leading-5 font-bold text-pretty text-ink-900">
      <template v-if="countdown">
        {{ page.banner }} <span class="whitespace-nowrap tabular-nums">{{ countdown }}</span>
      </template>
      <template v-else>{{ page.bannerFallback }}</template>
    </p>

    <div class="flex w-full max-w-[640px] flex-col items-center gap-5 px-5 pt-5">
      <header class="flex w-full items-center justify-between gap-3 rounded-block bg-white px-5 py-3.5 shadow-panel">
        <NuxtLink to="/" class="block" aria-label="Bijles Bèta — naar de homepage">
          <img src="/logo.svg" alt="Bijles Bèta" width="142" height="56" class="block h-8 w-auto">
        </NuxtLink>
        <div class="flex items-center gap-3">
          <span class="font-display text-[13px] font-bold whitespace-nowrap text-ink-900">{{ page.headerSpots }}</span>
          <a
            href="#proefles"
            class="inline-block rounded-btn bg-brand-500 px-3 py-2.5 font-display text-[12px] leading-[11px] font-bold whitespace-nowrap text-ink-900 transition duration-300 hover:bg-ink-900 hover:text-white"
          >
            {{ page.ctaLabel }}
          </a>
        </div>
      </header>

      <RatingLine centered class="mt-10" />

      <span class="inline-block rounded-btn bg-brand-500 px-2.5 py-[5px] font-display text-[13px] font-bold text-ink-900">
        {{ page.badge }}
      </span>

      <!-- Wider than the 640px column it sits in: at this size the title needs
         the room, and the flex parent centres the overflow. -->
      <h1 class="w-[calc(100vw-40px)] max-w-[760px] text-center text-[clamp(36px,7.5vw,56px)] leading-[1.1] tracking-[-0.025em] text-balance">
        {{ page.title.before }}<span class="text-brand-700">{{ page.title.highlight }}</span>
      </h1>
      <p class="max-w-[46ch] text-center text-base leading-[1.625] text-pretty text-ink-700">{{ vak ? page.subjectsFor[vak] : page.subjects }} {{ page.body }}</p>

      <div class="mt-14 flex flex-col items-center gap-2">
        <p class="kicker">{{ page.claim.kicker }}</p>
        <h2 class="text-center text-[28px] leading-[1.2] tracking-[-0.025em] text-balance">{{ page.claim.title }}</h2>
      </div>
    </div>

    <div id="proefles" class="flex w-full max-w-[640px] scroll-mt-6 flex-col items-center px-5 pt-8 pb-16">
      <ActieClaimCard :source="`${route.path} (boven)`" positie="hero" />

      <ul class="mt-10 flex w-full max-w-[480px] list-none flex-col gap-2.5 p-0 text-[15px] leading-normal">
        <li v-for="(item, i) in page.promises" :key="i" class="flex items-start gap-2.5">
          <svg
            class="mt-1 h-[18px] w-[18px] flex-none text-success-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M4 12l6 6L20 6" />
          </svg>
          <span v-if="typeof item === 'string'">{{ item }}</span>
          <span v-else>{{ item.before }}<span class="font-display font-bold text-mint">{{ item.amount }}</span>{{ item.after }}</span>
        </li>
      </ul>

      <p class="mt-12 text-center text-[13px] text-ink-700">
        {{ page.contactLead }}
        <a
          :href="contact.whatsappHref"
          class="font-display font-semibold text-ink-900 underline decoration-[1.5px] underline-offset-[3px]"
          @click="analytics.whatsappGeklikt({ positie: 'hero' })"
        >{{ contact.phone }}</a>
      </p>
    </div>

    <section class="w-full bg-white px-[clamp(16px,4vw,24px)] py-[clamp(56px,7vw,88px)]">
      <div class="mx-auto max-w-[1000px]">
        <div class="mb-[clamp(26px,3.5vw,38px)] text-center">
          <RatingLine centered class="mb-3" />
          <h2 class="text-[clamp(23px,2.6vw,28px)] tracking-[-0.025em]">Wat vinden onze leerlingen?</h2>
        </div>

        <ReviewCarousel card-ground="sand" />
      </div>
    </section>

    <!-- The campaign's packages, as on `/openingsactie-utrecht/`. -->
    <section class="w-full bg-white px-[clamp(16px,4vw,24px)] pb-[clamp(56px,7vw,90px)]">
      <div class="mx-auto max-w-[1400px]">
        <PricingSection
          :intro="openingsactieUtrecht.pricingIntro"
          href="#proefles-onder"
          :cta-label="page.ctaLabel"
          :loose-blurb="openingsactieUtrecht.looseLessonBlurb"
          :assurances="openingsactieUtrecht.pricingAssurances"
        >
          <template #extra="{ plan }">
            <div class="mt-5 rounded-card bg-brand-500/15 px-4 py-3.5">
              <p class="mb-1.5 font-display text-[13px] font-bold text-brand-700">{{ openingsactieUtrecht.pricingOffer }}</p>
              <p class="flex flex-wrap items-baseline gap-2">
                <span class="font-display text-[19px] leading-[28.5px] font-bold text-mint">
                  {{ formatPrice(freeWeekBenefit[plan.slug] ?? 0) }}
                </span>
                <span class="text-[13px]">besparing</span>
              </p>
            </div>
          </template>
        </PricingSection>
      </div>
    </section>

    <!-- Stappenplan: the `/zo-werkt-het` cards, with the campaign's copy. -->
    <section class="w-full bg-white px-[clamp(16px,4vw,40px)] pb-20">
      <div class="mx-auto max-w-[1400px] md:px-9">
        <p class="kicker mb-3 text-center text-[19px]">{{ openingsactieUtrecht.steps.kicker }}</p>
        <h2 class="mb-8 text-center text-[28px] leading-[44px] tracking-[-0.025em]">{{ openingsactieUtrecht.steps.title }}</h2>

        <div class="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          <article
            v-for="step in openingsactieUtrecht.steps.items"
            :key="step.title"
            class="flex flex-col gap-5 rounded-card border border-line-ink p-6"
          >
            <img :src="step.icon" alt="" class="h-[50px] w-[50px] object-contain object-left">
            <div>
              <h3 class="mb-2.5 text-[19px] leading-[26px]">{{ step.title }}</h3>
              <p class="text-[13px] leading-normal">{{ step.body }}</p>
            </div>
          </article>
        </div>

        <p class="mt-8 text-center">
          <a href="#proefles-onder" class="inline-flex items-center gap-3 font-display text-[15px] font-bold underline">
            {{ openingsactieUtrecht.steps.link }} <BtnArrow />
          </a>
        </p>
      </div>
    </section>

    <!-- The proefles card again, for whoever read this far: the first one is
         a long scroll back up by now. -->
    <section id="proefles-onder" class="flex w-full scroll-mt-6 flex-col items-center bg-white px-5 pb-[clamp(56px,7vw,88px)]">
      <div class="mb-8 flex flex-col items-center gap-2">
        <p class="kicker">{{ page.claim.kicker }}</p>
        <h2 class="text-center text-[28px] leading-[1.2] tracking-[-0.025em] text-balance">{{ page.claim.title }}</h2>
      </div>
      <ActieClaimCard :source="`${route.path} (onder)`" positie="trial_cta" />
    </section>

    <FaqSection :items="openingsactieUtrecht.faqs" contact-link="whatsapp" class="w-full" />

    <!-- No sitewide footer on this layout, so the way back to the cookie
         banner has to live here. -->
    <p class="flex w-full justify-center gap-5 bg-white px-5 pt-12 pb-[clamp(48px,6vw,80px)] text-[13px] text-ink-700">
      <NuxtLink to="/privacy" class="underline">Privacy</NuxtLink>
      <button type="button" class="cursor-pointer underline" @click="reopen">{{ cookieConsent.manageLabel }}</button>
    </p>

    <!-- Room for the bar below, so it never covers the end of the page. -->
    <div class="h-[76px] w-full bg-white md:hidden" aria-hidden="true" />

    <Transition
      enter-from-class="translate-y-full"
      enter-active-class="transition-transform duration-300 ease-out"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="showBar"
        class="fixed inset-x-0 bottom-0 z-[900] flex items-center justify-between gap-3 border-t border-line-ink bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-float md:hidden"
      >
        <p class="min-w-0 font-display text-[14px] leading-[18px] font-bold">
          {{ openingsactieUtrecht.stickyBar }}
        </p>
        <!-- Shown only past the first form, so the nearer one is below. -->
        <a href="#proefles-onder" class="btn-primary shrink-0">
          {{ page.ctaLabel }} <BtnArrow />
        </a>
      </div>
    </Transition>
  </div>
</template>
