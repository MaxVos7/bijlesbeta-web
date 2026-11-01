<script setup lang="ts">
import { mijnPackages as copy } from '~/data/mijn'
import type { PackagePeriod, PackagePreview, PackageState } from '~/utils/mijn-types'

/*
  A customer's package with periods ("Pakket (nieuw)"), next to the old
  subscription page. From `GET api/package`: the running period and what has
  been used of it, the payment, the next period, cancelling, and a suggestion
  from a tutor waiting to be confirmed. Every action reloads the state.
*/
definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer'] })
useHead({ title: copy.title })

const api = useMijnApi()

const state = ref<PackageState | null>(null)
const loading = ref(true)
const error = ref('')
const unavailable = ref(false)
const notice = ref('')

async function load() {
  try {
    state.value = (await api<{ data: PackageState }>('package')).data
    await loadPreview()
  }
  catch (e: any) {
    // The portal answers 404 while the feature is switched off for this account.
    if ((e?.statusCode ?? e?.status) === 404) unavailable.value = true
    else error.value = mijnErrorMessage(e)
  }
  finally {
    loading.value = false
  }
}

onMounted(load)

const enrollment = computed(() => state.value?.enrollment ?? null)
const periods = computed(() => state.value?.periods ?? [])
const active = computed(() => periods.value.find(p => p.status === 'active') ?? null)
const next = computed(() => periods.value.find(p => p.status === 'scheduled') ?? null)
const past = computed(() => periods.value.filter(p => p.status === 'ended' || p.status === 'settled'))

type Mode = 'none' | 'pending' | 'active' | 'future' | 'pause' | 'ended'

const mode = computed<Mode>(() => {
  const e = enrollment.value
  if (!e) return 'none'
  if (e.status === 'pending') return 'pending'
  if (e.status === 'ended') return 'ended'
  if (active.value) return 'active'
  if (next.value) {
    // A gap between the last period and the next one is the summer pause.
    const last = past.value.at(-1)
    return last && addDays(last.ends_on, 1) !== next.value.starts_on ? 'pause' : 'future'
  }
  return 'ended'
})

const plan = computed(() => enrollment.value?.plan ?? null)
const cancelled = computed(() => enrollment.value?.status === 'cancelled')

const headerTitle = computed(() => (plan.value ? `${plan.value.name}, ${copy.perPeriod(plan.value.hours_per_period)}` : ''))
const headerSub = computed(() => (plan.value ? copy.planSub(euros(plan.value.price), euros(plan.value.extra_hour_price)) : ''))

const headerPill = computed<{ tone: 'ok' | 'open' | 'grey' | 'bad', label: string }>(() => {
  if (cancelled.value) return { tone: 'grey', label: copy.pill.cancelled }
  switch (mode.value) {
    case 'future': return { tone: 'grey', label: copy.pill.startsIn(daysUntil(next.value!.starts_on)) }
    case 'pause': return { tone: 'grey', label: copy.pill.pause }
    case 'ended': return { tone: 'grey', label: copy.pill.ended }
    case 'pending': return { tone: 'open', label: copy.pill.pending }
    default: return { tone: 'ok', label: copy.pill.running }
  }
})

// ── The running period ──────────────────────────────────────────────
const usage = computed(() => active.value?.usage ?? null)
const extraHours = computed(() => (usage.value ? Math.max(0, usage.value.used - (usage.value.hours + usage.value.credit)) : 0))
const extraCents = computed(() => Math.round(extraHours.value * (plan.value?.extra_hour_price ?? 0)))

const usedLabel = computed(() => {
  const u = usage.value
  if (!u) return ''
  return extraHours.value > 0
    ? copy.usedExtra(hoursLabel(u.used), hoursLabel(extraHours.value))
    : copy.usedOf(hoursLabel(u.used), hoursLabel(u.hours + u.credit))
})

const capLabel = computed(() => {
  const u = usage.value
  if (!u) return ''
  return u.credit > 0 ? copy.capWithCredit(u.hours, hoursLabel(u.credit)) : copy.capNoCredit(u.hours)
})

const stats = computed(() => {
  const u = usage.value
  if (!u) return []

  if (extraHours.value > 0) {
    return [
      { k: copy.statFollowed, v: hoursLabel(u.used), s: copy.statAllUsed },
      { k: copy.statExtra, v: hoursLabel(extraHours.value), s: copy.statExtraCost(euros(extraCents.value)) },
      { k: copy.statCredit, v: hoursLabel(0), s: copy.statCreditUsedUp },
    ]
  }

  return [
    { k: copy.statUsed, v: hoursLabel(u.used), s: copy.statOfPackage(u.hours) },
    { k: copy.statLeft, v: hoursLabel(u.hours + u.credit - u.used), s: u.credit > 0 ? copy.statInclCredit : '' },
    { k: copy.statCredit, v: hoursLabel(u.credit), s: u.credit >= (state.value?.credit.max_hours ?? Infinity) ? copy.statCreditMax : copy.statCreditNext },
  ]
})

const activeNote = computed(() => {
  const u = usage.value
  if (!u) return ''
  if (extraHours.value > 0) return copy.extraNote(hoursLabel(extraHours.value), euros(extraCents.value))
  if (u.credit > 0 && u.credit >= (state.value?.credit.max_hours ?? Infinity)) return copy.creditMaxNote(state.value!.credit.max_hours!)
  return ''
})

type Pay = { tone: 'ok' | 'open' | 'grey' | 'bad', pill: string, title: string, text: string, url: string | null, open: boolean }

/** What the payment block says, from the period's invoice. Starting before paying is normal. */
function paymentOf(period: PackagePeriod): Pay {
  const p = period.payment
  if (!p) return { tone: 'grey', pill: copy.pill.preparing, title: copy.payNone, text: copy.payPreparingText, url: null, open: false }

  const amount = euros(Math.round(p.total * 100))
  switch (p.status) {
    case 'open': return { tone: 'open', pill: copy.pill.open, title: copy.payOpenTitle(amount, p.due_date ? longDate(p.due_date) : null), text: copy.payOpenText, url: p.pay_url, open: true }
    case 'paid': return { tone: 'ok', pill: copy.pill.paid, title: copy.payPaidTitle(amount), text: copy.payPaidText, url: null, open: false }
    case 'uncollectible': return { tone: 'bad', pill: copy.pill.uncollectible, title: amount, text: copy.payUncollectibleText, url: null, open: false }
    default: return { tone: 'grey', pill: copy.pill.preparing, title: copy.payNone, text: copy.payPreparingText, url: null, open: false }
  }
}

const pay = computed(() => (active.value ? paymentOf(active.value) : null))

// ── Cancelling ──────────────────────────────────────────────────────
const cancelOpen = ref(false)
const stopsOn = computed(() => state.value?.cancel?.stops_on ?? null)
/** The package stops after a later period than the running one: the customer is past the notice date. */
const lateCancel = computed(() => !!state.value?.cancel?.is_late)
const extraPeriod = computed(() => state.value?.cancel?.extra_period ?? null)

// ── A suggestion ────────────────────────────────────────────────────
const preview = ref<PackagePreview | null>(null)
const agreed = ref(false)
const showAgreeError = ref(false)

async function loadPreview() {
  const e = state.value?.enrollment
  if (!e || e.status !== 'pending') return

  try {
    preview.value = (await api<{ data: PackagePreview }>('package/preview', { query: { package_plan_id: e.plan.id, first_week: e.first_week } })).data
  }
  catch {
    preview.value = null
  }
}

const suggestRows = computed(() => {
  const pv = preview.value
  if (!pv) return []
  return [
    { k: copy.suggestRowsHours, v: copy.perPeriod(pv.plan.hours_per_period) },
    { k: copy.suggestRowsFirst, v: `${periodRange(pv.starts_on, pv.ends_on)} (${copy.lessonWeeks(pv.lesson_weeks)})` },
    { k: copy.suggestRowsThen, v: copy.rowThenValue(longDate(pv.next_starts_on)) },
    { k: copy.suggestRowsExtra, v: euros(pv.plan.extra_hour_price) },
  ]
})

const suggestNote = computed(() => {
  const pv = preview.value
  const e = enrollment.value
  if (!pv || !e || !pv.starts_later_than_asked) return ''

  const asked = isoWeekStart(e.first_week)
  return asked < new Date().toLocaleDateString('sv-SE')
    ? copy.suggestLate(longDate(asked), longDate(pv.starts_on))
    : copy.laterStart(longDate(pv.starts_on))
})

// ── Actions ─────────────────────────────────────────────────────────
const busy = ref(false)
const actionError = ref('')

/** Posts an action, then shows its message and reloads. A 422 shows Laravel's own sentence. */
async function act(path: string, message?: string | ((result: any) => string)) {
  busy.value = true
  actionError.value = ''

  try {
    const result = await api<{ message?: string }>(path, { method: 'POST' })
    notice.value = (typeof message === 'function' ? message(result) : message) || result.message || ''
    cancelOpen.value = false
    agreed.value = false
    showAgreeError.value = false
    await load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  catch (e: any) {
    const errors: Record<string, string[]> = e?.data?.errors ?? {}
    actionError.value = Object.values(errors)[0]?.[0] ?? mijnErrorMessage(e)
  }
  finally {
    busy.value = false
  }
}

function confirmSuggestion() {
  showAgreeError.value = true
  if (!agreed.value || !enrollment.value) return
  return act(`package/${enrollment.value.id}/confirm`, (result: { data?: { starts_on?: string | null } }) =>
    result.data?.starts_on ? copy.confirmed(longDate(result.data.starts_on)) : '')
}

function rejectSuggestion() {
  if (!enrollment.value || !window.confirm(copy.rejectConfirm)) return
  return act(`package/${enrollment.value.id}/reject`, copy.rejected)
}

function cancelPackage() {
  if (!enrollment.value) return
  return act(`package/${enrollment.value.id}/cancel`)
}

const nextPay = computed(() => (next.value ? paymentOf(next.value) : null))
</script>

<template>
  <div class="container-page">
    <p v-if="notice" class="mb-6 rounded-card bg-success-50 p-4 text-[15px] text-success-900" role="status">{{ notice }}</p>

    <p v-if="loading" class="text-[15px] text-ink-700">{{ copy.loading }}</p>
    <template v-else-if="unavailable">
      <p class="kicker">{{ copy.kicker }}</p>
      <h1 class="mt-3 text-[32px] leading-[44px]">{{ copy.title }}</h1>
      <p class="panel mt-6 p-6 text-[15px] text-ink-800">{{ copy.unavailable }}</p>
    </template>
    <p v-else-if="error" class="field-error" role="alert">{{ error }}</p>

    <template v-else-if="state">
      <!-- ── No package ───────────────────────────────────────── -->
      <template v-if="mode === 'none'">
        <p class="kicker">{{ copy.kicker }}</p>
        <h1 class="mt-3 text-[32px] leading-[44px]">{{ copy.title }}</h1>

        <p v-if="!state.can_start" class="panel mt-6 p-6 text-[15px] text-ink-800">
          {{ copy.legacyNotice }}
          <NuxtLink to="/mijn/pakket/" class="font-semibold underline">{{ copy.legacyLink }}</NuxtLink>
        </p>
        <p v-else-if="!state.plans.length" class="panel mt-6 p-6 text-[15px] text-ink-800">{{ copy.noPlans }}</p>
        <section v-else class="mt-6 flex flex-wrap items-center gap-8 rounded-block bg-accent-500 p-8">
          <div class="min-w-[260px] flex-1">
            <h2 class="text-[28px] leading-[44px] text-ink-900">{{ copy.noneTitle }}</h2>
            <p class="max-w-[520px] text-ink-900">{{ copy.noneBody }}</p>
          </div>
          <NuxtLink to="/mijn/pakketten/kiezen/" class="btn bg-ink-900 text-white">{{ copy.noneCta }}</NuxtLink>
        </section>

        <p class="mt-5"><NuxtLink to="/mijn/pakketten/uitleg/" class="font-display text-[14px] font-bold underline">{{ copy.explainLink }}</NuxtLink></p>
      </template>

      <!-- ── A suggestion from a tutor ────────────────────────── -->
      <section v-else-if="mode === 'pending' && enrollment" class="mx-auto max-w-[760px] rounded-block bg-white p-6 shadow-panel sm:p-10">
        <p class="kicker">{{ copy.suggestKicker }}</p>
        <h1 class="mt-3 text-[32px] leading-[44px]">{{ copy.suggestTitle(enrollment.suggested_by_name) }}</h1>
        <p class="mt-1 text-ink-700">{{ copy.suggestIntro }}</p>

        <div class="mt-7 rounded-card bg-linen px-6 pb-4 pt-2">
          <div class="flex flex-wrap items-center justify-between gap-3 pb-2 pt-4">
            <h2 class="font-display text-[24px] font-bold leading-[34px]">{{ enrollment.plan.name }}</h2>
            <span class="font-display text-[24px] font-extrabold text-ink-900">{{ euros(enrollment.plan.price) }} <span class="font-body text-[14px] font-normal text-ink-700">{{ copy.perPeriodShort }}</span></span>
          </div>
          <div v-for="row in suggestRows" :key="row.k" class="flex justify-between gap-4 border-t border-line-ink py-2.5">
            <span class="text-ink-700">{{ row.k }}</span>
            <span class="text-right font-semibold">{{ row.v }}</span>
          </div>
        </div>

        <p v-if="suggestNote" class="mt-4 rounded-card bg-brand-500/15 p-4 text-[14px] ring-1 ring-brand-500/50" role="note">{{ suggestNote }}</p>

        <p class="mt-5 text-[14px]">
          {{ copy.terms(euros(enrollment.plan.extra_hour_price), enrollment.plan.hours_per_period)[0] }}
          <NuxtLink to="/mijn/pakketten/uitleg/" class="font-bold underline">{{ copy.explainLink }}</NuxtLink>
        </p>

        <label class="mt-4 flex items-start gap-3 text-[14px]">
          <input v-model="agreed" type="checkbox" class="mt-0.5 size-[22px] flex-none accent-ink-900">
          <span>
            {{ copy.agreeBefore }}
            <a v-if="state.terms_and_conditions_link" :href="state.terms_and_conditions_link" target="_blank" rel="noopener" class="font-semibold underline">{{ copy.agreeLink }}</a>
            <template v-else>{{ copy.agreeFallback }}</template>.
          </span>
        </label>
        <p v-if="showAgreeError && !agreed" class="field-error" role="alert">{{ copy.agreeRequired }}</p>
        <p v-if="actionError" class="field-error mt-3" role="alert">{{ actionError }}</p>

        <div class="mt-7 flex flex-wrap gap-3">
          <button type="button" class="btn-primary btn-lg" :disabled="busy" @click="confirmSuggestion">{{ copy.confirm }}</button>
          <button type="button" class="btn-secondary btn-lg" :disabled="busy" @click="rejectSuggestion">{{ copy.reject }}</button>
        </div>
        <p class="mt-3 text-[12px] text-ink-700"><b class="text-ink-900">{{ copy.invoiceByMail }}</b></p>
      </section>

      <!-- ── A package ────────────────────────────────────────── -->
      <template v-else-if="plan">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p class="kicker">{{ copy.kicker }}</p>
            <h1 class="mt-3 text-[32px] leading-[44px]">{{ headerTitle }}</h1>
            <p class="mt-0.5 text-ink-700">{{ headerSub }}</p>
          </div>
          <MijnPill :tone="headerPill.tone">{{ headerPill.label }}</MijnPill>
        </div>

        <p v-if="cancelled && enrollment?.ends_on" class="mt-6 rounded-card bg-brand-500/20 p-4 text-[15px] text-ink-900" role="status">
          {{ copy.cancelledBanner(longDate(enrollment.ends_on)) }}
        </p>

        <div class="mt-7 grid items-start gap-6 md:grid-cols-3">
          <!-- Main card -->
          <section class="min-w-0 rounded-card bg-white p-6 shadow-panel sm:p-8 md:col-span-2">
            <template v-if="mode === 'active' && active && usage">
              <p class="font-display text-[14px] font-bold uppercase leading-none tracking-[0.06em] text-brand-700">{{ copy.currentKicker }}</p>
              <h2 class="mt-2 text-[26px] leading-[40px]">{{ copy.periodTitle(active.position, periodRange(active.starts_on, active.ends_on)) }}</h2>
              <p class="text-ink-700">{{ copy.lessonWeeks(active.lesson_weeks) }}</p>
              <p v-if="active.is_truncated" class="mt-2 text-[14px] text-ink-700">{{ copy.truncated(active.lesson_weeks) }}</p>

              <p v-if="activeNote" class="mt-5 rounded-card bg-brand-500/15 p-4 text-[14px] ring-1 ring-brand-500/50" role="note">{{ activeNote }}</p>

              <div class="mt-6">
                <div class="mb-2.5 flex flex-wrap items-baseline justify-between gap-3">
                  <span class="font-display text-[16px] font-bold text-ink-900">{{ usedLabel }}</span>
                  <span class="text-[13px] font-semibold text-ink-700">{{ capLabel }}</span>
                </div>
                <MijnHourBlocks :used="usage.used" :hours="usage.hours" :credit="usage.credit" :label="usedLabel" />
                <div class="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-ink-700">
                  <span class="flex items-center gap-1.5"><i class="size-3 rounded-[3px] bg-accent-500" />{{ copy.legendPackage }}</span>
                  <span v-if="usage.credit > 0" class="flex items-center gap-1.5"><i class="size-3 rounded-[3px] border-2 border-dashed border-ink-900/45" />{{ copy.legendCredit }}</span>
                  <span v-if="extraHours > 0" class="flex items-center gap-1.5"><i class="size-3 rounded-[3px] bg-ink-900" />{{ copy.legendExtra }}</span>
                </div>
              </div>

              <div class="mt-6 grid gap-3 sm:grid-cols-3">
                <div v-for="stat in stats" :key="stat.k" class="rounded-card bg-linen p-4">
                  <p class="text-[13px] font-semibold text-ink-700">{{ stat.k }}</p>
                  <p class="font-display text-[26px] font-extrabold leading-[1.2] text-ink-900">{{ stat.v }}</p>
                  <p class="text-[12px] text-ink-700">{{ stat.s }}</p>
                </div>
              </div>

              <div
                v-if="pay"
                class="mt-7 flex flex-wrap items-center gap-5 rounded-card px-6 py-5"
                :class="pay.open ? 'bg-brand-500/15 ring-1 ring-brand-500/45' : 'bg-linen'"
              >
                <div class="min-w-[220px] flex-1">
                  <MijnPill :tone="pay.tone">{{ pay.pill }}</MijnPill>
                  <p class="mt-2 font-display text-[16px] font-bold text-ink-900">{{ pay.title }}</p>
                  <p class="text-[14px] text-ink-700">{{ pay.text }}</p>
                </div>
                <a v-if="pay.url" :href="pay.url" target="_blank" rel="noopener" class="btn-primary">{{ copy.pay }}</a>
              </div>
            </template>

            <template v-else-if="mode === 'future' && next">
              <MijnPill tone="grey">{{ headerPill.label }}</MijnPill>
              <h2 class="mt-2 text-[28px] leading-[44px]">{{ copy.futureTitle(longDate(next.starts_on)) }}</h2>
              <p class="text-ink-700">{{ copy.periodTitle(next.position, periodRange(next.starts_on, next.ends_on)) }} · {{ copy.lessonWeeks(next.lesson_weeks) }}</p>
              <p class="mt-5 rounded-card bg-linen p-4 text-[14px]">{{ copy.futureNote }}</p>
            </template>

            <template v-else-if="mode === 'pause' && next">
              <MijnPill tone="grey">{{ copy.pill.pause }}</MijnPill>
              <h2 class="mt-2 text-[26px] leading-[40px]">{{ copy.pauseTitle(longDate(next.starts_on)) }}</h2>
              <p>{{ copy.pauseBody(hoursLabel(state.credit.hours)) }}</p>
              <p class="mt-2 text-[14px] text-ink-700">{{ copy.pauseSmall }}</p>
            </template>

            <template v-else>
              <MijnPill tone="grey">{{ copy.pill.ended }}</MijnPill>
              <h2 class="mt-2 text-[26px] leading-[40px]">{{ copy.endedTitle(enrollment?.ends_on ? longDate(enrollment.ends_on) : null) }}</h2>
              <div class="mt-4 flex flex-wrap items-center gap-4 rounded-card bg-linen px-5 py-4">
                <p class="whitespace-nowrap font-display text-[28px] font-extrabold text-ink-900">{{ hoursLabel(state.credit.hours) }}</p>
                <p class="min-w-[220px] flex-1 text-[14px]">{{ copy.endedCredit }}</p>
              </div>
              <NuxtLink v-if="state.can_start" to="/mijn/pakketten/kiezen/" class="btn-secondary mt-4">{{ copy.restart }}</NuxtLink>
            </template>
          </section>

          <!-- Side column -->
          <aside class="flex min-w-0 flex-col gap-4">
            <section v-if="next && mode === 'active'" class="panel p-6">
              <p class="font-display text-[14px] font-bold uppercase leading-none tracking-[0.06em] text-ink-700">{{ copy.nextKicker }}</p>
              <h3 class="mt-2.5 text-[19px] leading-[26px]">{{ copy.nextTitle(longDate(next.starts_on)) }}</h3>
              <p class="mt-1 text-[14px] text-ink-700">{{ copy.nextText(longDate(next.ends_on)) }}</p>
              <div class="mt-4 flex items-center justify-between border-t border-line-ink pt-4">
                <span class="font-display text-[16px] font-bold text-ink-900">{{ euros(next.price) }}</span>
                <MijnPill :tone="nextPay!.tone">{{ nextPay!.open ? nextPay!.pill : copy.pill.invoiceComing }}</MijnPill>
              </div>
            </section>
            <section v-else-if="mode === 'active' && cancelled && active" class="panel p-6">
              <p class="font-display text-[14px] font-bold uppercase leading-none tracking-[0.06em] text-ink-700">{{ copy.nextKicker }}</p>
              <h3 class="mt-2.5 text-[19px] leading-[26px]">{{ copy.noNext }}</h3>
              <p class="mt-1 text-[14px] text-ink-700">{{ copy.noNextText(longDate(active.ends_on)) }}</p>
            </section>

            <section class="rounded-card bg-linen p-6">
              <h3 class="text-[16px] leading-6">{{ copy.creditTitle }}</h3>
              <p class="mt-1.5 text-[14px]">{{ copy.creditBody(plan.hours_per_period) }}</p>
              <NuxtLink to="/mijn/pakketten/uitleg/" class="mt-2.5 inline-block font-display text-[14px] font-bold underline">{{ copy.explainLink }}</NuxtLink>
            </section>

            <NuxtLink to="/mijn/pakketten/periodes/" class="panel flex justify-between px-6 py-[18px] font-display text-[15px] font-bold">
              {{ copy.periodsLink }}<span aria-hidden="true">›</span>
            </NuxtLink>
          </aside>
        </div>

        <!-- History -->
        <section v-if="past.length" class="mt-9" aria-labelledby="history">
          <div class="flex items-baseline justify-between">
            <h2 id="history" class="text-[22px] leading-[44px]">{{ copy.historyTitle }}</h2>
            <NuxtLink to="/mijn/pakketten/periodes/" class="font-display text-[14px] font-bold underline">{{ copy.historyAll }}</NuxtLink>
          </div>
          <div class="panel mt-1 divide-y divide-line-ink">
            <div v-for="p in [...past].reverse().slice(0, 2)" :key="p.id" class="flex flex-wrap items-center gap-4 px-6 py-[18px]">
              <div class="min-w-[200px] flex-1">
                <p class="font-display text-[16px] font-bold text-ink-900">{{ copy.periodTitle(p.position, periodRange(p.starts_on, p.ends_on)) }}</p>
                <p class="text-[14px] text-ink-700">{{ copy.lessonWeeks(p.lesson_weeks) }}</p>
              </div>
              <span class="font-display text-[15px] font-bold">{{ euros(p.price) }}</span>
              <MijnPill :tone="paymentOf(p).tone">{{ paymentOf(p).pill }}</MijnPill>
            </div>
          </div>
        </section>

        <!-- Cancel -->
        <div v-if="state.cancel && enrollment?.status === 'running'" class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line-ink pt-6">
          <p class="text-[14px] text-ink-700">
            {{ lateCancel || !active ? copy.cancelTextPlain : copy.cancelText(longDate(active.ends_on)) }}
          </p>
          <button type="button" class="font-display text-[14px] font-bold underline underline-offset-4" @click="cancelOpen = true; actionError = ''">{{ copy.cancelLink }}</button>
        </div>
      </template>

      <!-- Cancel dialog -->
      <div
        v-if="cancelOpen && stopsOn"
        class="fixed inset-0 z-[100] grid place-items-center overflow-auto bg-ink-900/55 p-5"
        @keydown.esc="cancelOpen = false"
      >
        <div class="w-full max-w-[520px] rounded-block bg-white p-8 shadow-panel" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
          <h2 id="cancel-title" class="text-[24px] leading-[34px]">{{ copy.cancelTitle }}</h2>
          <p class="mt-3 text-[17px]">{{ copy.cancelBody(longDate(stopsOn)) }}</p>

          <p v-if="lateCancel && active && extraPeriod" class="mt-4 rounded-card bg-brand-500/15 p-4 text-[14px] ring-1 ring-brand-500/50" role="note">
            <b>{{ copy.cancelLateTitle }}</b><br>
            {{ copy.cancelLateBody(longDate(active.ends_on), longDate(extraPeriod.starts_on), longDate(extraPeriod.ends_on), euros(extraPeriod.price)) }}
          </p>

          <ul class="mt-5 flex flex-col gap-3 text-[15px]">
            <li v-for="fact in copy.cancelFacts" :key="fact" class="flex gap-3">
              <span aria-hidden="true" class="flex-none font-extrabold text-success-900">✓</span>
              <span>{{ fact }}</span>
            </li>
          </ul>

          <p v-if="actionError" class="field-error mt-4" role="alert">{{ actionError }}</p>
          <div class="mt-6 flex flex-wrap gap-3">
            <button type="button" class="btn bg-ink-900 text-white" :disabled="busy" @click="cancelPackage">{{ copy.cancelSubmit }}</button>
            <button type="button" class="btn-secondary" :disabled="busy" @click="cancelOpen = false">{{ copy.cancelBack }}</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
