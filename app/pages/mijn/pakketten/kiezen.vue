<script setup lang="ts">
import { mijnPackages as copy } from '~/data/mijn'
import type { PackagePreview, PackageState } from '~/utils/mijn-types'

/*
  Starting a package with periods: pick a plan, pick the week it starts, check
  the first period against `GET api/package/preview`, agree and start. The
  portal confirms it straight away; its refusals (an old subscription still
  running, a week in the past) come back as one sentence and are shown as is.
*/
definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer', 'mijn-packages'] })
useHead({ title: copy.chooseTitle })

const api = useMijnApi()

const state = ref<PackageState | null>(null)
const loading = ref(true)
const error = ref('')
const unavailable = ref(false)

const planId = ref<number | null>(null)
const week = ref<string | null>(null)
const preview = ref<PackagePreview | null>(null)
const previewError = ref('')
const agreed = ref(false)
const showAgreeError = ref(false)
const busy = ref(false)
const actionError = ref('')
const started = ref<PackagePreview | null>(null)

onMounted(async () => {
  try {
    state.value = (await api<{ data: PackageState }>('package')).data
    planId.value = state.value.plans[0]?.id ?? null
    // Next Monday, not "this week": a period that began days ago is still paid in full.
    const upcoming = state.value.start_weeks.filter(w => !w.holiday)
    week.value = (upcoming.find(w => w.starts_on > today()) ?? upcoming[0])?.week ?? null
  }
  catch (e: any) {
    if ((e?.statusCode ?? e?.status) === 404) unavailable.value = true
    else error.value = mijnErrorMessage(e)
  }
  finally {
    loading.value = false
  }
})

const selectedPlan = computed(() => state.value?.plans.find(p => p.id === planId.value) ?? null)

// The summary follows the choice; a stale answer must not overwrite a newer one.
let request = 0
watch([planId, week], async () => {
  if (!planId.value || !week.value) return

  const mine = ++request
  previewError.value = ''

  try {
    const result = (await api<{ data: PackagePreview }>('package/preview', { query: { package_plan_id: planId.value, first_week: week.value } })).data
    if (mine === request) preview.value = result
  }
  catch (e: any) {
    if (mine !== request) return
    preview.value = null
    previewError.value = mijnErrorMessage(e)
  }
})

/** The chosen week began already: the customer pays a whole period that started days ago. */
const weekBegun = computed(() => {
  const chosen = state.value?.start_weeks.find(w => w.week === week.value)
  return chosen && chosen.starts_on <= today() ? chosen.starts_on : null
})

const weeks = computed(() => (state.value?.start_weeks ?? []).map((w, i) => ({
  ...w,
  number: weekNumber(w.week),
  disabled: !!w.holiday,
  label: i === 0 ? copy.thisWeek : '',
})))

const summaryRows = computed(() => {
  const pv = preview.value
  const plan = selectedPlan.value
  if (!pv || !plan) return []
  return [
    { k: copy.rowPlan, v: plan.name },
    { k: copy.rowHours, v: `${pv.hours} uur` },
    { k: copy.rowPrice, v: euros(pv.price) },
    { k: copy.rowExtra, v: euros(plan.extra_hour_price) },
    { k: copy.rowThen, v: copy.rowThenValue(longDate(pv.next_starts_on)) },
  ]
})

async function start() {
  showAgreeError.value = true
  if (!agreed.value || !selectedPlan.value || !week.value) return

  busy.value = true
  actionError.value = ''

  try {
    await api('package', { method: 'POST', body: { package_plan_id: selectedPlan.value.id, first_week: week.value, agreed_to_terms: true } })
    started.value = preview.value
    window.scrollTo({ top: 0 })
  }
  catch (e: any) {
    const errors: Record<string, string[]> = e?.data?.errors ?? {}
    actionError.value = Object.values(errors)[0]?.[0] ?? mijnErrorMessage(e)
  }
  finally {
    busy.value = false
  }
}

const planCard = (selected: boolean) => [
  'block h-full w-full rounded-card p-6 text-left transition',
  selected ? 'bg-brand-500/15 ring-[3px] ring-ink-900' : 'bg-white shadow-panel',
]
</script>

<template>
  <div class="container-page">
    <p v-if="loading" class="text-[15px] text-ink-700">{{ copy.loading }}</p>
    <p v-else-if="unavailable" class="panel p-6 text-[15px] text-ink-800">{{ copy.unavailable }}</p>
    <p v-else-if="error" class="field-error" role="alert">{{ error }}</p>

    <!-- Started -->
    <section v-else-if="started" class="panel max-w-[640px] p-8 sm:p-10">
      <p class="kicker">{{ copy.startedKicker }}</p>
      <h1 class="mt-3 text-[32px] leading-[44px]">{{ (started.starts_on <= today() ? copy.startedTitleBegun : copy.startedTitle)(longDate(started.starts_on)) }}</h1>
      <p class="mt-2">{{ copy.startedBody(started.plan.name, started.hours) }}</p>
      <NuxtLink to="/mijn/pakketten/" class="btn-primary btn-lg mt-6">{{ copy.toPackage }}</NuxtLink>
    </section>

    <!-- Not possible: there is already a package, or one in the old system -->
    <template v-else-if="state && (!state.can_start || !state.plans.length)">
      <p class="kicker">{{ copy.chooseKicker }}</p>
      <h1 class="mt-3 text-[32px] leading-[44px]">{{ copy.chooseTitle }}</h1>
      <p class="panel mt-6 p-6 text-[15px] text-ink-800">
        <template v-if="!state.plans.length">{{ copy.noPlans }}</template>
        <template v-else-if="state.enrollment">
          <NuxtLink to="/mijn/pakketten/" class="font-semibold underline">{{ copy.toPackage }}</NuxtLink>
        </template>
        <template v-else>
          {{ copy.legacyNotice }}
          <NuxtLink to="/mijn/pakket/" class="font-semibold underline">{{ copy.legacyLink }}</NuxtLink>
        </template>
      </p>
    </template>

    <template v-else-if="state">
      <p class="kicker">{{ copy.chooseKicker }}</p>
      <h1 class="mt-3 text-[32px] leading-[44px]">{{ copy.chooseTitle }}</h1>
      <p class="mt-2 max-w-[640px] text-ink-700">
        {{ copy.chooseIntro }}
        <NuxtLink to="/mijn/pakketten/uitleg/" class="underline">{{ copy.explainLink }}</NuxtLink>
      </p>

      <!-- 1. Plan -->
      <section class="mt-9" aria-labelledby="step-1">
        <h2 id="step-1" class="text-[22px] leading-[44px]">{{ copy.step1 }}</h2>
        <ul class="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="plan in state.plans" :key="plan.id">
            <button type="button" :class="planCard(planId === plan.id)" :aria-pressed="planId === plan.id" @click="planId = plan.id">
              <span class="block font-display text-[22px] font-bold leading-[30px]">{{ plan.name }}</span>
              <span class="mt-3 block">
                <span class="font-display text-[40px] font-extrabold leading-none text-ink-900">{{ plan.hours_per_period }}</span>
                <span class="font-semibold"> {{ copy.hoursUnit }}</span>
              </span>
              <span class="block text-[14px] text-ink-700">{{ copy.aboutPerWeek(plan.hours_per_period / 4) }}</span>
              <span class="mt-4 block font-display text-[20px] font-bold text-ink-900">
                {{ euros(plan.price) }} <span class="font-body text-[14px] font-normal text-ink-700">{{ copy.perPeriodShort }}</span>
              </span>
              <span class="block text-[14px] text-ink-700">{{ copy.perHour(euros(plan.price / plan.hours_per_period)) }}</span>
              <span class="mt-4 block border-t border-line-ink pt-4 text-[14px]">{{ copy.extraHour(euros(plan.extra_hour_price)) }}</span>
              <span class="mt-4 flex items-center gap-2 font-display text-[14px] font-bold text-ink-900">
                <span
                  class="size-[18px] rounded-full border-2"
                  :class="planId === plan.id ? 'border-ink-900 bg-ink-900 shadow-[inset_0_0_0_3px_white]' : 'border-ink-900/45'"
                />
                {{ planId === plan.id ? copy.chosen : copy.choose }}
              </span>
            </button>
          </li>
        </ul>
      </section>

      <!-- 2. Week -->
      <section class="mt-11" aria-labelledby="step-2">
        <h2 id="step-2" class="text-[22px] leading-[44px]">{{ copy.step2 }}</h2>
        <p class="text-ink-700">{{ copy.weeksIntro }}</p>
        <ul class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="w in weeks" :key="w.week">
            <button
              type="button"
              class="block w-full rounded-card p-4 text-left"
              :class="[
                w.disabled ? 'cursor-not-allowed bg-white opacity-70 ring-1 ring-ink-900/10' : week === w.week ? 'bg-brand-500/15 ring-[3px] ring-ink-900' : 'bg-white ring-1 ring-ink-900/15',
              ]"
              :disabled="w.disabled"
              :aria-pressed="week === w.week && !w.disabled"
              @click="week = w.week"
            >
              <span class="flex items-center justify-between gap-2">
                <span class="font-display text-[12px] font-bold tracking-[0.04em] text-ink-700">{{ copy.weekLabel(w.number) }}</span>
                <span v-if="w.label" class="rounded-full bg-ink-900 px-2.5 py-0.5 font-display text-[12px] font-bold text-white">{{ w.label }}</span>
              </span>
              <span class="mt-1 block font-display text-[17px] font-bold text-ink-900">{{ longDate(w.starts_on) }}</span>
              <span v-if="w.holiday" class="block text-[13px] text-ink-700">{{ w.holiday }}</span>
            </button>
          </li>
        </ul>
      </section>

      <!-- 3. Check and confirm -->
      <section class="mt-11" aria-labelledby="step-3">
        <h2 id="step-3" class="text-[22px] leading-[44px]">{{ copy.step3 }}</h2>
        <div class="mt-2 grid items-start gap-6 md:grid-cols-2">
          <div class="panel p-7">
            <p class="font-display text-[14px] font-bold uppercase leading-none tracking-[0.06em] text-ink-700">{{ copy.firstPeriod }}</p>

            <template v-if="preview">
              <h3 class="mt-2 text-[24px] leading-9">{{ periodRange(preview.starts_on, preview.ends_on) }}</h3>
              <p class="text-ink-700">{{ copy.lessonWeeks(preview.lesson_weeks) }}</p>
              <p v-if="preview.starts_later_than_asked" class="mt-4 rounded-card bg-brand-500/15 p-4 text-[14px] ring-1 ring-brand-500/50" role="note">{{ copy.laterStart(longDate(preview.starts_on)) }}</p>
              <p v-if="weekBegun" class="mt-4 rounded-card bg-brand-500/15 p-4 text-[14px] ring-1 ring-brand-500/50" role="note">{{ copy.weekBegun(longDate(weekBegun)) }}</p>
              <p v-if="preview.is_truncated" class="mt-4 rounded-card bg-brand-500/15 p-4 text-[14px] ring-1 ring-brand-500/50" role="note">{{ copy.shortPeriod(preview.lesson_weeks) }}</p>
              <div class="mt-4 flex flex-col">
                <div v-for="row in summaryRows" :key="row.k" class="flex justify-between gap-4 border-t border-line-ink py-2.5">
                  <span class="text-ink-700">{{ row.k }}</span>
                  <span class="text-right font-semibold">{{ row.v }}</span>
                </div>
              </div>
            </template>
            <p v-else-if="previewError" class="field-error mt-3" role="alert">{{ previewError }}</p>
            <p v-else class="mt-3 text-ink-700">{{ copy.loading }}</p>
          </div>

          <div v-if="selectedPlan" class="flex flex-col gap-4">
            <div class="rounded-card bg-linen p-6">
              <h3 class="text-[16px] leading-6">{{ copy.termsTitle }}</h3>
              <ul class="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-[14px]">
                <li v-for="term in copy.terms(euros(selectedPlan.extra_hour_price), selectedPlan.hours_per_period)" :key="term">{{ term }}</li>
              </ul>
              <NuxtLink to="/mijn/pakketten/uitleg/" class="mt-3 inline-block font-display text-[14px] font-bold underline">{{ copy.explainLink }}</NuxtLink>
            </div>

            <p v-if="actionError" class="rounded-card bg-danger/10 p-4 text-[14px] text-danger ring-1 ring-danger/35" role="alert">
              <b>{{ copy.startFailed }}</b> {{ actionError }}
            </p>

            <label class="flex items-start gap-3 text-[14px]">
              <input v-model="agreed" type="checkbox" class="size-[22px] flex-none accent-ink-900" @change="showAgreeError = false">
              <span>
                {{ copy.agreeBefore }}
                <a v-if="state.terms_and_conditions_link" :href="state.terms_and_conditions_link" target="_blank" rel="noopener" class="font-semibold underline">{{ copy.agreeLink }}</a>
                <template v-else>{{ copy.agreeFallback }}</template>.
              </span>
            </label>
            <p v-if="showAgreeError && !agreed" class="field-error -mt-2" role="alert">{{ copy.agreeRequired }}</p>

            <button type="button" class="btn-primary btn-lg w-full" :disabled="busy || !preview" @click="start">{{ copy.start }}</button>
            <p class="text-center text-[12px] text-ink-700"><b class="text-ink-900">{{ copy.invoiceByMail }}</b></p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
