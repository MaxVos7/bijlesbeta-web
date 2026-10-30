<script setup lang="ts">
import { actieEnd, actieGroningen as page, lastDay } from '~/data/actie-groningen'
import { contact, cookieConsent, tagline } from '~/data/site'

/**
 * The Groningen campaign ("Actie Groningen"), a copy of `/openingsactie-utrecht`,
 * itself from the Claude Design handoff `Actie Utrecht.dc.html`.
 *
 * A landing page for ad traffic, so it runs on the `bare` layout and brings
 * its own chrome: a header with the logo and one CTA, and a footer with the
 * contact details — no navigation in either, so there is nowhere to wander
 * off to. The hero carries the proefles form itself, as the landings do, and
 * every other CTA scrolls to the proefles block at the foot. Both forms hand
 * the visitor to the wizard like everywhere else; `LeadForm` mails the office
 * with this page's path, which is how the office knows the lead came in on
 * the campaign.
 *
 * Out of the index and out of the sitemap: it is a temporary offer, and its
 * Groningen copy shouldn't compete with `/bijles-aan-huis-groningen/` in search.
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
const { fill } = useDaysLeft(lastDay)

/*
  The banner's live clock. Until it is mounted, and again once the offer is
  over, the banner falls back to its static line with the days-left phrase.
*/
const { parts: left, ended } = useCountdown(actieEnd)
const bannerText = computed(() => {
  const p = left.value
  if (!p || ended.value) return fill(page.banner)
  const pad = (n: number) => String(n).padStart(2, '0')
  const days = `${p.days} ${p.days === 1 ? page.countdown.units.days[0] : page.countdown.units.days[1]}`
  return page.bannerTimer.replace('{timer}', `${days} ${pad(p.hours)}:${pad(p.minutes)}:${pad(p.seconds)}`)
})
const { reopen, level, open: consentOpen } = useCookieConsent()

/*
  The phone-only bar at the foot of the screen. It waits until the hero has
  scrolled away — the hero carries its own CTA — and steps aside while the
  proefles block is on screen, where it would only cover the form it points
  at. It never shares the screen with the cookie banner, which also sits on
  the bottom edge: until the visitor has made a choice, there is no bar.
*/
const hero = ref<HTMLElement>()
const heroInView = ref(true)
const proeflesInView = ref(false)
const showBar = computed(
  () => level.value !== null && !consentOpen.value && !heroInView.value && !proeflesInView.value,
)

let observer: IntersectionObserver | undefined
onMounted(() => {
  const proefles = document.getElementById('proefles')
  if (!hero.value || !('IntersectionObserver' in window)) return

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === hero.value) heroInView.value = entry.isIntersecting
      else proeflesInView.value = entry.isIntersecting
    }
  })
  observer.observe(hero.value)
  if (proefles) observer.observe(proefles)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div>
    <p class="bg-brand-500 px-[clamp(16px,4vw,40px)] py-2.5 text-center font-display text-sm leading-5 font-bold text-pretty text-ink-900 tabular-nums">
      {{ bannerText }}
    </p>

    <!-- The hero runs on a photograph with an ink wash that is heaviest under
         the copy, and carries the page's own header inside it. -->
    <section ref="hero" class="relative isolate overflow-hidden bg-ink-900 pb-[clamp(48px,7vw,88px)]">
      <img
        src="/img/home-hero.jpg"
        alt=""
        width="2400"
        height="1350"
        fetchpriority="high"
        class="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]"
      >
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-linear-100 from-ink-900/65 from-0% via-ink-900/40 via-50% to-ink-900/10"
        aria-hidden="true"
      />

      <div class="px-[clamp(20px,3vw,40px)] pt-[clamp(16px,3vw,40px)] pb-[clamp(16px,2vw,24px)]">
        <header
          class="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 rounded-block bg-white px-6 py-4 shadow-panel"
        >
          <NuxtLink to="/" class="block" aria-label="Bijles Bèta — naar de homepage">
            <img
              src="/logo.svg"
              alt="Bijles Bèta"
              width="142"
              height="56"
              class="block h-[clamp(28px,4vw,56px)] w-auto"
            >
          </NuxtLink>
          <div class="flex items-center gap-3">
            <span class="hidden font-display text-[13px] font-bold whitespace-nowrap text-ink-900 sm:inline">
              {{ fill(page.headerOffer) }}
            </span>
            <a
              href="#proefles"
              class="inline-block rounded-btn bg-brand-500 px-3 py-2.5 font-display text-[12px] leading-[11px] font-bold whitespace-nowrap text-ink-900 transition duration-300 hover:bg-ink-900 hover:text-white md:px-5 md:py-4 md:text-[15px]"
            >
              {{ page.ctaLabel }}
            </a>
          </div>
        </header>
      </div>

      <div class="px-[clamp(12px,3vw,24px)] pt-[clamp(36px,5vw,72px)]">
        <!-- On a phone the form panel is left out of the hero — it follows
             straight after it — so the column stays short enough for the
             landscape photo to cover without being blown up past its
             resolution. The review closes the copy column at every width;
             from md the form sits beside it on the right. -->
        <div
          class="mx-auto grid max-w-[1200px] items-center gap-[clamp(32px,5vw,60px)] md:grid-cols-2"
        >
          <div class="max-w-[640px] min-w-0">
            <RatingLine tone="inverse" class="mb-[18px]" />

            <span class="mb-[18px] inline-block rounded-btn bg-brand-500 px-2.5 py-[5px] font-display text-[13px] font-bold text-ink-900">
              {{ fill(page.hero.badge) }}
            </span>

            <h1
              class="mb-[18px] max-w-[18ch] text-[clamp(30px,4.2vw,36px)] leading-[1.12] tracking-[-0.025em] text-pretty text-white"
            >
              {{ page.hero.title.before }}<span class="text-brand-500">{{ vak ? page.hero.title.highlightFor[vak] : page.hero.title.highlight }}</span>
            </h1>
            <p class="mb-7 max-w-[46ch] text-[clamp(15px,1.2vw,16px)] leading-[1.625] text-white/85">
              {{ page.hero.body }}
            </p>

            <CheckList :items="page.hero.promises" tone="inverse" class="mb-7" />

            <figure class="max-w-[470px] rounded-card bg-white px-5 py-4 shadow-float">
              <StarRating :value="page.heroReview.stars" />
              <span class="sr-only">{{ page.heroReview.stars }} van 5 sterren</span>
              <blockquote class="mt-2 font-display text-[15px] leading-[1.5] font-bold text-ink-800">
                {{ page.heroReview.quote }}
              </blockquote>
              <figcaption class="mt-1.5 text-[13px] text-ink-700">– {{ page.heroReview.author }}</figcaption>
            </figure>
          </div>

          <!-- The proefles form in the hero itself, as on the landings, so an
               ad click lands one step from the wizard. Desktop only; a phone
               gets the same panel straight under the hero. The closing block
               keeps its own copy further down. -->
          <div class="hidden w-full max-w-[470px] min-w-0 justify-self-end rounded-card bg-brand-500 p-[clamp(20px,2.4vw,30px)] md:col-start-2 md:block">
            <p class="mb-1.5 text-[15px] font-semibold text-on-brand">{{ page.heroForm.kicker }}</p>
            <h2 class="mb-2.5 text-[clamp(21px,2.2vw,27px)] tracking-[-0.025em]">{{ page.heroForm.title }}</h2>
            <p class="mb-3 text-sm leading-relaxed text-on-brand-muted">{{ page.heroForm.body }}</p>
            <p class="mb-[18px] flex items-center gap-2 text-sm font-bold text-ink-900">
              <span class="relative flex h-2.5 w-2.5 flex-none" aria-hidden="true">
                <span class="absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75 motion-safe:animate-ping" />
                <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-success-500" />
              </span>
              <span>{{ fill(page.heroForm.offer) }}</span>
            </p>

            <ActieCountdown :end="actieEnd" :copy="page.countdown" class="mb-[18px]" />

            <!-- Mounted three times on this page (one per breakpoint here,
                 plus the closing block), so it names itself in the office mail. -->
            <LeadForm
              :source="`${route.path} (hero)`"
              positie="hero"
              actie="groningen"
              class="rounded-tile bg-linen p-[clamp(14px,1.6vw,18px)]"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- The hero's form panel, on a phone only: straight under the hero
         rather than inside it, so the photo there doesn't have to stretch. -->
    <section class="bg-sand px-[clamp(12px,3vw,24px)] pt-6 pb-[clamp(40px,5vw,64px)] md:hidden">
      <div class="mx-auto w-full max-w-[470px] rounded-card bg-brand-500 p-[clamp(20px,2.4vw,30px)]">
        <p class="mb-1.5 text-[15px] font-semibold text-on-brand">{{ page.heroForm.kicker }}</p>
        <h2 class="mb-2.5 text-[clamp(21px,2.2vw,27px)] tracking-[-0.025em]">{{ page.heroForm.title }}</h2>
        <p class="mb-3 text-sm leading-relaxed text-on-brand-muted">{{ page.heroForm.body }}</p>
            <p class="mb-[18px] flex items-center gap-2 text-sm font-bold text-ink-900">
              <span class="relative flex h-2.5 w-2.5 flex-none" aria-hidden="true">
                <span class="absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75 motion-safe:animate-ping" />
                <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-success-500" />
              </span>
              <span>{{ fill(page.heroForm.offer) }}</span>
            </p>

        <ActieCountdown :end="actieEnd" :copy="page.countdown" class="mb-[18px]" />

        <LeadForm
          :source="`${route.path} (onder hero, mobiel)`"
          positie="hero"
          actie="groningen"
          class="rounded-tile bg-linen p-[clamp(14px,1.6vw,18px)]"
        />
      </div>
    </section>

    <!-- The pain, then the turn: under the form panel on a phone, straight
         under the hero on desktop. -->
    <section class="bg-white px-[clamp(16px,4vw,40px)] py-[clamp(56px,7vw,88px)]">
      <div
        class="mx-auto grid max-w-[1200px] items-center gap-[clamp(32px,5vw,64px)] md:grid-cols-2"
      >
        <img
          :src="page.pain.image"
          :alt="page.pain.alt"
          width="1200"
          height="675"
          loading="lazy"
          class="block aspect-[4/3] w-full rounded-card object-cover object-[35%_center]"
        >

        <div class="min-w-0">
          <p class="kicker mb-2.5">{{ page.pain.kicker }}</p>
          <h2 class="mb-4 text-[clamp(23px,2.6vw,28px)] leading-[1.3] tracking-[-0.025em] text-balance">
            {{ page.pain.title }}
          </h2>
          <p class="mb-7 text-[15px] leading-[28px]">{{ page.pain.body }}</p>

          <div class="mb-7 rounded-card bg-sand px-5 py-4">
            <p class="mb-1.5 font-display text-[19px] leading-[26px] font-bold">{{ page.pain.turnTitle }}</p>
            <p class="text-[15px] leading-[28px]">{{ page.pain.turnBody }}</p>
          </div>

          <a href="#proefles" class="btn-primary btn-lg">
            {{ page.ctaLabel }} <BtnArrow />
          </a>
        </div>
      </div>
    </section>

    <section class="bg-sand px-[clamp(16px,4vw,24px)] py-[clamp(56px,7vw,88px)]">
      <div class="mx-auto max-w-[1000px]">
        <div class="mb-[clamp(26px,3.5vw,38px)] text-center">
          <RatingLine centered class="mb-3" />
          <h2 class="text-[clamp(23px,2.6vw,28px)] tracking-[-0.025em]">{{ page.reviewsTitle }}</h2>
        </div>

        <ReviewCarousel :items="page.reviews" />
      </div>
    </section>

    <section class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(56px,7vw,88px)] pb-[clamp(56px,7vw,90px)]">
      <div class="mx-auto max-w-[1400px]">
        <div class="mb-[clamp(30px,4vw,46px)] text-center">
          <p class="kicker mb-2.5">{{ page.features.kicker }}</p>
          <h2 class="text-[28px] leading-[44px] tracking-[-0.025em] text-balance">{{ page.features.title }}</h2>
        </div>

        <div class="grid gap-[clamp(14px,1.8vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))]">
          <div
            v-for="feature in page.features.items"
            :key="feature.title"
            class="flex flex-col gap-3 rounded-card border border-line-ink bg-white px-3.5 pt-3.5 pb-[26px]"
          >
            <img
              :src="feature.image"
              :alt="feature.alt"
              loading="lazy"
              class="block aspect-[4/3] w-full rounded-card object-cover"
            >
            <h3 class="mt-2 text-[19px] leading-[26px] tracking-[-0.01em]">{{ feature.title }}</h3>
            <p class="text-[13px] leading-normal text-ink-700">{{ feature.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <TrialCta id="proefles" :copy="page.trialCta" actie="groningen" class="scroll-mt-6 pt-0" />

    <section class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(24px,3vw,40px)] pb-[clamp(56px,7vw,90px)]">
      <PriceLadder :copy="page.priceLadder" href="#proefles" actie="groningen" class="mx-auto max-w-[1008px]">
        <template #offer>
          <div class="flex flex-col gap-4 rounded-card bg-brand-500 p-5 md:flex-row md:items-center md:justify-between md:gap-8">
            <div class="min-w-0">
              <p class="font-display text-[19px] leading-[26px] font-bold text-ink-900">{{ page.priceCountdown.title }}</p>
              <p class="mt-1 text-[15px] leading-[24px] text-on-brand">{{ page.priceCountdown.body }}</p>
            </div>
            <ActieCountdown :end="actieEnd" :copy="page.countdown" class="w-full md:w-[340px] md:flex-none" />
          </div>
        </template>
      </PriceLadder>
    </section>

    <!-- Stappenplan: the `/zo-werkt-het` cards, with the campaign's copy. -->
    <section class="bg-white px-[clamp(16px,4vw,40px)] pb-20">
      <div class="mx-auto max-w-[1400px] md:px-9">
        <p class="kicker mb-3 text-center text-[19px]">{{ page.steps.kicker }}</p>
        <h2 class="mb-8 text-center text-[28px] leading-[44px] tracking-[-0.025em]">{{ page.steps.title }}</h2>

        <div class="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          <article
            v-for="step in page.steps.items"
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
          <a href="#proefles" class="inline-flex items-center gap-3 font-display text-[15px] font-bold underline">
            {{ page.steps.link }} <BtnArrow />
          </a>
        </p>
      </div>
    </section>

    <ComparisonTable />

    <!-- The homepage's team block, with the campaign's own introduction. -->
    <section class="bg-white px-[clamp(16px,4vw,24px)] pb-[clamp(64px,8vw,100px)]">
      <div
        class="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]"
      >
        <div class="min-w-0">
          <p class="kicker mb-2.5">{{ page.team.kicker }}</p>
          <h2 class="mb-5 text-[clamp(23px,2.5vw,28px)] tracking-[-0.025em]">{{ page.team.title }}</h2>
          <!-- No link to /over-ons: this page keeps visitors on it. -->
          <p class="max-w-[46ch] text-base leading-[1.75] text-ink-700">{{ page.team.body }}</p>
        </div>
        <div class="min-w-0">
          <img
            src="/img/team-collage.webp"
            alt="Het team van Bijles Bèta"
            class="mx-auto block h-auto w-full max-w-[520px]"
            loading="lazy"
          >
        </div>
      </div>
    </section>

    <FaqSection :items="page.faqs" contact-link="whatsapp" actie="groningen" />

    <!-- Brand band and contact only: no navigation, like the header. -->
    <footer class="bg-white px-[clamp(20px,4vw,40px)] pt-[84px] pb-[clamp(48px,6vw,108px)] text-base leading-normal text-ink-900">
      <div class="mx-auto flex max-w-[1400px] flex-col items-center gap-3">
        <NuxtLink to="/" class="block" aria-label="Bijles Bèta — naar de homepage">
          <img src="/logo.svg" alt="Bijles Bèta" width="142" height="56" class="block h-[60.581px] w-[154px] object-cover">
        </NuxtLink>
        <p class="w-full text-center font-display text-[22px] leading-[44px] font-bold">{{ tagline }}</p>

        <div class="mt-6 flex flex-wrap justify-center gap-x-[60px] gap-y-3 text-center">
          <div class="flex flex-col gap-3">
            <h2 class="font-display text-[15px] leading-[22px] font-bold text-accent-500">Contact</h2>
            <div>
              <p class="text-[13px]">Whatsapp of bel ons!</p>
              <p class="font-display font-semibold">
                <a :href="contact.phoneHref" @click="analytics.telefoonGeklikt({ positie: 'footer', actie: 'groningen' })">{{ contact.phone }}</a>
              </p>
            </div>
            <div>
              <p class="text-[13px]">Liever mailen?</p>
              <p class="font-display font-semibold">
                <a :href="contact.emailHref">{{ contact.email }}</a>
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <h2 class="font-display text-[15px] leading-[22px] font-bold text-accent-500">Bijles Bèta</h2>
            <p>{{ contact.address.street }}, {{ contact.address.postalCode }} {{ contact.address.city }}</p>
            <p>
              <strong>Te bereiken op:</strong>
              <template v-for="row in contact.openingHoursRows" :key="row.days">
                <br>{{ row.days }} {{ row.hours }}
              </template>
            </p>
          </div>
        </div>

        <!-- The page's own footer replaces the sitewide one, so it must keep
             the only way back to the cookie banner. -->
        <p class="mt-6 flex gap-5 text-[13px] text-ink-700">
          <NuxtLink to="/privacy" class="underline">Privacy</NuxtLink>
          <button type="button" class="cursor-pointer underline" @click="reopen">{{ cookieConsent.manageLabel }}</button>
        </p>
      </div>
    </footer>

    <!-- Room for the bar below, so it never covers the end of the footer. -->
    <div class="h-[76px] md:hidden" aria-hidden="true" />

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
          {{ fill(page.stickyBar) }}
        </p>
        <a href="#proefles" class="btn-primary shrink-0">
          {{ page.ctaLabel }} <BtnArrow />
        </a>
      </div>
    </Transition>
  </div>
</template>
