<script setup lang="ts">
import { contact, looseLesson, pricingPlans } from '~/data/site'

/**
 * The price ladder, from the Claude Design handoff `Tarieven Bijles Beta.dc.html`
 * (round 1a desktop, 1b mobile). Its layout and copy are the design's; its
 * type and its surfaces are not. Every size, weight and colour is the one the
 * page's other blocks use — the `kicker`, the 28px/44px section title, the
 * 19px/26px card heading, the 15px/28px body, `rounded-card` on `line-ink`,
 * `btn-primary btn-lg` and `CtaNote` — so the block reads as part of the page
 * rather than as an import. Its surfaces run on three colours only — white,
 * the brand amber (`brand-500`) and the ink — with no darker gold or amber
 * tint, which read brown next to the amber; the last package is the amber one.
 *
 * The rates are never in the copy. Each tier names a plan by slug and the
 * price, the struck-through rate and the monthly sum are read off
 * `pricingPlans` and `looseLesson`, so this block can't quote a price
 * `/tarieven/` doesn't.
 *
 * Below 768px it is a different block, not a reflowed one: a four-way hours
 * selector over a single dark card, as the design's mobile board draws it —
 * dark for every tier, the amber package included.
 */
type Copy = { long: string; short: string }

const props = withDefaults(
  defineProps<{
    copy: {
      kicker: string
      title: Copy
      body: Copy
      tiers: readonly { slug: string; toggle: string; label?: string; blurb: Copy }[]
      initialTier: string
      noDiscount: string
      offer: {
        lastDay: string
        title: string
        saving: string
        firstMonth: string
        none: string
        hours: Readonly<Record<string, number>>
      }
      payPerLesson: string
      featuredBadge: string
      selectorLabel: string
      included: { title: Copy; items: readonly Copy[] }
      terms: { title: string; items: readonly Copy[] }
      cta: string
      help: { before: string; link: string }
    }
    href?: string
    actie?: string
  }>(),
  { href: '/aanmelden/', actie: undefined },
)

const analytics = useAnalytics()
const { fill } = useDaysLeft(props.copy.offer.lastDay)

/** The undiscounted rate every saving is measured against. */
const baseRate = looseLesson.price

const tiers = computed(() =>
  props.copy.tiers.map((tier) => {
    const plan = pricingPlans.find((p) => p.slug === tier.slug)
    const price = plan?.price ?? looseLesson.price
    const hours = plan ? Number(plan.hoursLabel.match(/\d+/)?.[0] ?? 0) : 0
    return {
      ...tier,
      name: plan?.name ?? looseLesson.name,
      label: tier.label ?? plan?.hoursLabel ?? '',
      price,
      hours,
      discount: baseRate - price,
      monthLabel: hours ? `${props.copy.offer.hours[tier.slug] ? props.copy.offer.firstMonth : 'Per maand'} (${hours} uur)` : 'Per maand',
      /** What the free week takes off the first invoice, and what that invoice comes to. */
      freeWeek: (props.copy.offer.hours[tier.slug] ?? 0) * price,
      firstMonth: hours * price - (props.copy.offer.hours[tier.slug] ?? 0) * price,
      month: hours ? `€${hours * price}` : props.copy.payPerLesson,
    }
  }),
)

/** The cheapest rate on the ladder is the one set in amber. */
const featuredSlug = computed(() => tiers.value.reduce((a, b) => (b.price < a.price ? b : a)).slug)

const selectedSlug = ref(props.copy.initialTier)
const selected = computed(() => tiers.value.find((t) => t.slug === selectedSlug.value) ?? tiers.value[0]!)
</script>

<template>
  <div>
    <!-- 1a: tablet and desktop. -->
    <div class="hidden flex-col gap-10 md:flex">
      <div class="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-end gap-10">
        <div>
          <p class="kicker mb-2.5">{{ copy.kicker }}</p>
          <h2 class="text-[28px] leading-[44px] tracking-[-0.025em] whitespace-pre-line text-balance">
            {{ copy.title.long }}
          </h2>
        </div>
        <p class="text-[15px] leading-[28px]">{{ copy.body.long }}</p>
      </div>

      <div class="grid grid-cols-2 gap-3 desk:grid-cols-4">
        <div
          v-for="tier in tiers"
          :key="tier.slug"
          class="relative flex flex-col gap-5 rounded-card border p-6"
          :class="tier.slug === featuredSlug ? 'border-brand-500 bg-brand-500' : 'border-line-ink bg-white'"
        >
          <span
            v-if="tier.slug === featuredSlug"
            class="absolute -top-[13px] left-6 rounded-btn bg-ink-900 px-2.5 py-[5px] font-display text-[13px] leading-4 font-bold text-white"
          >{{ copy.featuredBadge }}</span>

          <div>
            <p class="mb-1 text-[13px]" :class="tier.slug === featuredSlug ? 'text-ink-800' : 'text-ink-700'">{{ tier.label }}</p>
            <h3 class="text-[19px] leading-[26px]">{{ tier.name }}</h3>
          </div>

          <div>
            <p class="flex items-baseline gap-1.5">
              <span class="font-display text-[28px] leading-[44px] font-bold tracking-[-0.025em] text-ink-800">€{{ tier.price }}</span>
              <span class="text-[13px]" :class="tier.slug === featuredSlug ? 'text-ink-800' : 'text-ink-700'">/uur</span>
            </p>
            <div class="flex h-[22px] items-center gap-2">
              <template v-if="tier.discount > 0">
                <s class="text-[13px] leading-[19.5px] text-ink-800">€{{ baseRate }}</s>
                <span
                  class="rounded-btn px-[5px] py-px text-[11px] leading-[16.5px] font-semibold"
                  :class="tier.slug === featuredSlug ? 'bg-ink-900 text-white' : 'bg-brand-500 text-ink-800'"
                >−€{{ tier.discount }} per uur</span>
              </template>
              <span v-else class="text-[13px] text-ink-700">{{ copy.noDiscount }}</span>
            </div>
          </div>

          <div
            v-if="tier.freeWeek"
            class="rounded-btn px-3 py-2.5"
            :class="tier.slug === featuredSlug ? 'bg-ink-900 text-white' : 'bg-brand-500 text-ink-800'"
          >
            <p class="font-display text-[13px] leading-[19.5px] font-bold">{{ fill(copy.offer.title) }}</p>
            <p class="text-[13px] leading-[19.5px]">{{ copy.offer.saving }} <strong>€{{ tier.freeWeek }}</strong></p>
          </div>
          <p v-else class="rounded-btn border border-dashed border-line-ink px-3 py-2.5 text-[13px] leading-[19.5px] text-ink-700">
            {{ copy.offer.none }}
          </p>

          <div class="border-t pt-4" :class="tier.slug === featuredSlug ? 'border-ink-900/15' : 'border-line-ink'">
            <p class="text-[13px]" :class="tier.slug === featuredSlug ? 'text-ink-800' : 'text-ink-700'">{{ tier.monthLabel }}</p>
            <p v-if="tier.freeWeek" class="flex items-baseline gap-2">
              <s class="text-[13px] leading-[19.5px]" :class="tier.slug === featuredSlug ? 'text-ink-800' : 'text-ink-700'">€{{ tier.hours * tier.price }}</s>
              <span class="text-[15px] leading-[22.5px] font-semibold">€{{ tier.firstMonth }}</span>
            </p>
            <p v-else class="text-[15px] leading-[22.5px] font-semibold">{{ tier.month }}</p>
          </div>

          <p class="text-[13px] leading-normal">{{ tier.blurb.long }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-card border border-line-ink p-6">
          <h3 class="mb-4 text-[19px] leading-[26px]">{{ copy.included.title.long }}</h3>
          <ul class="grid gap-x-5 gap-y-2.5 desk:grid-cols-2">
            <li
              v-for="item in copy.included.items"
              :key="item.long"
              class="flex items-start gap-3 text-[15px] leading-[22.5px] font-semibold"
            >
              <span class="mt-px inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-500" aria-hidden="true">
                <svg class="h-2.5 w-2.5 text-ink-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6" /></svg>
              </span>
              {{ item.long }}
            </li>
          </ul>
        </div>
        <div class="rounded-card border border-line-ink p-6">
          <h3 class="mb-4 text-[19px] leading-[26px]">{{ copy.terms.title }}</h3>
          <ol class="grid gap-x-5 gap-y-2.5 desk:grid-cols-2">
            <li
              v-for="(item, i) in copy.terms.items"
              :key="item.long"
              class="flex items-start gap-3 text-[15px] leading-[22.5px] font-semibold"
            >
              <span class="w-5 flex-none font-display font-bold text-ink-900" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
              {{ item.long }}
            </li>
          </ol>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-6">
        <div class="flex flex-wrap items-center gap-4">
          <a :href="href" class="btn-primary btn-lg">{{ copy.cta }} <BtnArrow /></a>
          <CtaNote />
        </div>
        <p class="text-[15px] leading-[28px]">
          {{ copy.help.before }}
          <a
            :href="contact.whatsappHref"
            rel="noopener"
            class="border-b-[1.5px] border-ink-900 font-semibold hover:text-ink-900"
            @click="analytics.whatsappGeklikt({ positie: 'tarieven', actie })"
          >{{ copy.help.link }}</a>
        </p>
      </div>
    </div>

    <!-- 1b: phone. Choose the hours, see the price. -->
    <div class="flex flex-col md:hidden">
      <div class="pb-5">
        <p class="kicker mb-2.5">{{ copy.kicker }}</p>
        <h2 class="mb-2 text-[28px] leading-[44px] tracking-[-0.025em] text-balance">{{ copy.title.short }}</h2>
        <p class="text-[15px] leading-[28px]">{{ copy.body.short }}</p>
      </div>

      <div>
        <p id="price-ladder-hours" class="mb-2 text-[13px] text-ink-700">{{ copy.selectorLabel }}</p>
        <div class="grid grid-cols-4 gap-1.5 rounded-card bg-ink-900/[0.06] p-[5px]" role="group" aria-labelledby="price-ladder-hours">
          <button
            v-for="tier in tiers"
            :key="tier.slug"
            type="button"
            class="min-h-11 cursor-pointer rounded-btn font-display text-[15px] font-bold transition-colors"
            :class="tier.slug === selectedSlug ? 'bg-ink-900 text-white' : 'bg-transparent text-ink-800'"
            :aria-pressed="tier.slug === selectedSlug"
            @click="selectedSlug = tier.slug"
          >{{ tier.toggle }}</button>
        </div>
      </div>

      <div class="pt-4" aria-live="polite">
        <div
          class="flex flex-col gap-4 rounded-card bg-ink-900 p-6 text-white">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="mb-1 text-[13px] text-white/70">{{ selected.label }}</p>
              <h3 class="text-[19px] leading-[26px] text-white">{{ selected.name }}</h3>
            </div>
            <span
              v-if="selected.discount > 0"
              class="rounded-btn px-[5px] py-px text-[11px] leading-[16.5px] font-semibold whitespace-nowrap bg-brand-500 text-ink-800"
            >−€{{ selected.discount }} per uur</span>
          </div>
          <p class="flex items-baseline gap-1.5">
            <span class="font-display text-[28px] leading-[44px] font-bold tracking-[-0.025em]">€{{ selected.price }}</span>
            <span class="text-[13px] text-white/70">/uur</span>
            <s v-if="selected.discount > 0" class="ml-1 text-[13px] text-white/70">€{{ baseRate }}</s>
          </p>
          <div v-if="selected.freeWeek" class="rounded-btn bg-brand-500 px-3 py-2.5 text-ink-800">
            <p class="font-display text-[13px] leading-[19.5px] font-bold">{{ fill(copy.offer.title) }}</p>
            <p class="text-[13px] leading-[19.5px]">{{ copy.offer.saving }} <strong>€{{ selected.freeWeek }}</strong></p>
          </div>
          <p v-else class="text-[13px] leading-[19.5px] text-white/70">{{ copy.offer.none }}</p>
          <div class="flex items-center justify-between gap-3 border-t pt-4 border-white/15">
            <span class="text-[13px] text-white/70">{{ selected.monthLabel }}</span>
            <span v-if="selected.freeWeek" class="flex items-baseline gap-2">
              <s class="text-[13px] text-white/70">€{{ selected.hours * selected.price }}</s>
              <span class="text-[15px] leading-[22.5px] font-semibold">€{{ selected.firstMonth }}</span>
            </span>
            <span v-else class="text-[15px] leading-[22.5px] font-semibold">{{ selected.month }}</span>
          </div>
          <p class="text-[13px] leading-normal">{{ selected.blurb.short }}</p>
        </div>
      </div>

      <div class="pt-6">
        <h3 class="mb-3 text-[19px] leading-[26px]">{{ copy.included.title.short }}</h3>
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="item in copy.included.items"
            :key="item.short"
            class="inline-flex items-center gap-2 rounded-btn border border-line-ink px-2.5 py-1.5 text-[13px] font-semibold"
          >
            <span class="inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-brand-500" aria-hidden="true">
              <svg class="h-2 w-2 text-ink-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6" /></svg>
            </span>
            {{ item.short }}
          </li>
        </ul>
      </div>

      <div class="pt-6 pb-7">
        <h3 class="mb-3 text-[19px] leading-[26px]">{{ copy.terms.title }}</h3>
        <ol class="flex flex-col gap-2.5">
          <li
            v-for="(item, i) in copy.terms.items"
            :key="item.short"
            class="flex items-start gap-3 text-[15px] leading-[22.5px] font-semibold"
          >
            <span class="w-5 flex-none font-display font-bold text-ink-900" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            {{ item.short }}
          </li>
        </ol>
      </div>

      <!-- Not sticky, unlike the board: the page's own bar already pins a
           CTA to the foot of a phone, and two would stack. -->
      <div class="flex flex-col items-center gap-3">
        <a :href="href" class="btn-primary btn-lg w-full">{{ copy.cta }} <BtnArrow /></a>
        <CtaNote />
      </div>
    </div>
  </div>
</template>
