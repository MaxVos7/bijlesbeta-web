<script setup lang="ts">
import { mijnPackage as copy } from '~/data/mijn'

/*
  A customer's package: start one (or choose loose lessons), confirm or reject
  a tutor's suggestion, cancel, or switch. Everything the portal's package
  page and dashboard card let a customer do, from `GET api/subscription`.
  Every action reloads the state afterwards rather than guessing it.
*/
definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer'] })
useHead({ title: copy.title })

type Package = {
  id: number
  name: string
  monthly_price: number
  hours_per_month: number
  extra_hour_price: number
}

type State = {
  active: null | {
    id: number
    package_id: number
    package_name: string
    monthly_price: number
    hours_per_month: number
    hourly_rate: number
    end_description: string | null
    cancelled_at: string | null
    effective_end_date: string | null
    cancel: null | { description: string, next_package_starts: string }
  }
  pending: null | { id: number, package: Package, suggested_by_name: string | null }
  future: null | { package_name: string, monthly_price: number, started_at: string }
  can_start: boolean
  has_connected_child: boolean
  has_lessons: boolean
  children_count: number
  packages: Package[]
  loose_lesson_price: number | null
  first_month: { month_name: string, weeks_remaining: number, proration_factor: number }
  next_month_starts: string
  terms_and_conditions_link: string | null
}

const api = useMijnApi()

const state = ref<State | null>(null)
const loading = ref(true)
const error = ref('')
const notice = ref('')

// The start / confirm form
const choice = ref<number | 'loose' | null>(null)
const startsNextMonth = ref(false)
const agreed = ref(false)
const showAgreeError = ref(false)

// The running package
const mode = ref<'cancel' | 'change' | null>(null)
const nextPackageId = ref<number | null>(null)

const busy = ref(false)
const actionError = ref('')

async function load() {
  try {
    state.value = (await api<{ data: State }>('subscription')).data
  }
  catch (e) {
    error.value = mijnErrorMessage(e)
  }
  finally {
    loading.value = false
  }
}

onMounted(load)

/** The package the start / confirm form is about. */
const selectedPackage = computed(() => {
  if (state.value?.pending) return state.value.pending.package
  return state.value?.packages.find(p => p.id === choice.value) ?? null
})

const isLoose = computed(() => choice.value === 'loose')

/** The terms are agreed to for a package, never for loose lessons. */
const needsTerms = computed(() => !isLoose.value)

const firstMonth = computed(() => {
  const pkg = selectedPackage.value
  const month = state.value?.first_month
  if (!pkg || !month || month.proration_factor >= 1 || startsNextMonth.value || isLoose.value) return null

  return {
    amount: euros(Math.round(pkg.monthly_price * month.proration_factor)),
    hours: (pkg.hours_per_month * month.proration_factor).toFixed(0),
    weeks: month.weeks_remaining,
    month: month.month_name,
  }
})

const otherPackages = computed(() =>
  (state.value?.packages ?? []).filter(p => p.id !== state.value?.active?.package_id),
)

/** Posts an action, then shows its message and reloads. A 422 shows Laravel's own sentence. */
async function act(path: string, body: Record<string, unknown> = {}) {
  busy.value = true
  actionError.value = ''

  try {
    const result = await api<{ message?: string }>(path, { method: 'POST', body })
    notice.value = result.message ?? ''
    mode.value = null
    choice.value = null
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

function submitStart() {
  if (isLoose.value) return act('subscription/loose-lessons')

  showAgreeError.value = true
  if (!agreed.value || !selectedPackage.value) return

  return act('subscription', {
    package_id: selectedPackage.value.id,
    starts_next_month: startsNextMonth.value,
    agreed_to_terms: agreed.value,
  })
}

function submitConfirm() {
  showAgreeError.value = true
  if (!agreed.value || !state.value?.pending) return

  return act(`subscriptions/${state.value.pending.id}/confirm`, {
    starts_next_month: startsNextMonth.value,
    agreed_to_terms: agreed.value,
  })
}

function reject() {
  if (!state.value?.pending || !window.confirm(copy.rejectConfirm)) return
  return act(`subscriptions/${state.value.pending.id}/reject`)
}

function submitCancel() {
  if (!state.value?.active) return
  return act(`subscriptions/${state.value.active.id}/cancel`)
}

function submitChange() {
  if (!state.value?.active || !nextPackageId.value) return
  return act(`subscriptions/${state.value.active.id}/change`, { next_package_id: nextPackageId.value })
}

const optionClass = (selected: boolean) => [
  'panel block h-full w-full p-5 text-left transition',
  selected ? 'ring-2 ring-accent-500' : 'hover:bg-linen',
]
</script>

<template>
  <div class="container-page">
    <p class="kicker">{{ copy.kicker }}</p>
    <h1 class="mt-3 text-[32px] leading-[44px]">{{ copy.title }}</h1>

    <p v-if="notice" class="mt-6 rounded-card bg-success-50 p-4 text-[15px] text-success-900" role="status">{{ notice }}</p>
    <p v-if="error" class="field-error mt-6" role="alert">{{ error }}</p>
    <p v-if="loading" class="mt-8 text-[15px] text-ink-700">{{ copy.loading }}</p>

    <template v-else-if="state">
      <!-- ── A tutor's suggestion ─────────────────────────────── -->
      <section v-if="state.pending" class="panel mt-6 p-6 sm:p-8">
        <h2 class="font-display text-[20px] font-bold text-ink-900">{{ copy.pendingTitle(state.pending.suggested_by_name) }}</h2>

        <div class="mt-4 rounded-card bg-linen p-5">
          <p class="font-display text-[16px] font-bold text-ink-900">{{ state.pending.package.name }}</p>
          <p class="mt-1 text-[15px] text-ink-800">
            {{ copy.perMonth(state.pending.package.hours_per_month) }} ·
            {{ copy.perHour(euros(state.pending.package.extra_hour_price)) }}
            ({{ copy.monthly(euros(state.pending.package.monthly_price)) }})
          </p>
        </div>
      </section>

      <!-- ── No package yet ───────────────────────────────────── -->
      <template v-else-if="state.can_start">
        <div v-if="!state.has_connected_child" class="panel mt-6 p-6 text-[15px] leading-relaxed text-ink-800 sm:p-8">
          {{ copy.searching }}
        </div>

        <section v-else class="mt-6">
          <p v-if="!state.has_lessons" class="rounded-card bg-brand-500/20 p-4 text-[15px] text-ink-900">{{ copy.noLessonsYet }}</p>

          <h2 class="mt-6 font-display text-[20px] font-bold text-ink-900">{{ copy.chooseTitle }}</h2>
          <p v-if="state.children_count > 1" class="mt-1 text-[14px] text-ink-700">{{ copy.sharedHours }}</p>

          <ul class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <li v-for="pkg in state.packages" :key="pkg.id">
              <button type="button" :class="optionClass(choice === pkg.id)" :aria-pressed="choice === pkg.id" @click="choice = pkg.id">
                <span class="block font-display text-[16px] font-bold text-ink-900">{{ pkg.name }}</span>
                <span class="mt-2 block font-display text-[20px] font-bold text-ink-900">{{ copy.perMonth(pkg.hours_per_month) }}</span>
                <span class="mt-1 block text-[14px] text-ink-700">
                  {{ copy.perHour(euros(pkg.extra_hour_price)) }} ({{ copy.monthly(euros(pkg.monthly_price)) }})
                </span>
              </button>
            </li>
            <li v-if="state.loose_lesson_price !== null">
              <button type="button" :class="optionClass(isLoose)" :aria-pressed="isLoose" @click="choice = 'loose'">
                <span class="block font-display text-[16px] font-bold text-ink-900">{{ copy.looseTitle }}</span>
                <span class="mt-2 block font-display text-[20px] font-bold text-ink-900">{{ copy.looseSubtitle }}</span>
                <span class="mt-1 block text-[14px] text-ink-700">
                  {{ copy.perHour(euros(state.loose_lesson_price)) }} ({{ copy.loosePerLesson }})
                </span>
              </button>
            </li>
          </ul>
        </section>
      </template>

      <!-- ── Start date, first month and terms: for a new package or a suggestion ── -->
      <section
        v-if="state.pending || (state.can_start && state.has_connected_child && choice !== null)"
        class="panel mt-4 p-6 sm:p-8"
      >
        <template v-if="!isLoose">
          <fieldset>
            <legend class="font-display text-[16px] font-bold text-ink-900">{{ copy.startTitle }}</legend>
            <label class="mt-3 flex items-center gap-3 text-[15px] text-ink-800">
              <input v-model="startsNextMonth" type="radio" :value="false" class="accent-accent-500">
              {{ copy.startToday }}
            </label>
            <label class="mt-2 flex items-center gap-3 text-[15px] text-ink-800">
              <input v-model="startsNextMonth" type="radio" :value="true" class="accent-accent-500">
              {{ copy.startNextMonth(longDate(state.next_month_starts)) }}
            </label>
          </fieldset>

          <div v-if="firstMonth" class="mt-5 rounded-card bg-linen p-4 text-[14px] leading-relaxed text-ink-800">
            <p class="font-semibold first-letter:uppercase">{{ copy.firstMonthTitle(firstMonth.month) }}</p>
            <p class="mt-1">{{ copy.firstMonthBody(firstMonth.amount, firstMonth.hours, firstMonth.weeks) }}</p>
          </div>

          <div v-if="needsTerms" class="mt-6">
            <p class="font-display text-[16px] font-bold text-ink-900">{{ copy.termsTitle }}</p>
            <ul class="mt-2 list-disc pl-5 text-[14px] text-ink-800">
              <li v-for="rule in copy.terms" :key="rule">{{ rule }}</li>
            </ul>
            <label class="mt-4 flex items-start gap-3 text-[15px] text-ink-800">
              <input v-model="agreed" type="checkbox" class="mt-1 accent-accent-500">
              <span>
                {{ copy.agreeBefore }}
                <a
                  v-if="state.terms_and_conditions_link"
                  :href="state.terms_and_conditions_link"
                  target="_blank"
                  rel="noopener"
                  class="font-semibold underline"
                >{{ copy.agreeLink }}</a>
                <template v-else>{{ copy.agreeFallback }}</template>
              </span>
            </label>
            <p v-if="showAgreeError && !agreed" class="field-error">{{ copy.agreeRequired }}</p>
          </div>
        </template>

        <p v-if="actionError" class="field-error mt-4" role="alert">{{ actionError }}</p>

        <div class="mt-6 flex flex-wrap gap-3">
          <template v-if="state.pending">
            <button type="button" class="btn-primary" :disabled="busy" @click="submitConfirm">{{ copy.submitConfirm }}</button>
            <button type="button" class="btn-secondary" :disabled="busy" @click="reject">{{ copy.reject }}</button>
          </template>
          <button v-else type="button" class="btn-primary" :disabled="busy" @click="submitStart">
            {{ isLoose ? copy.submitLoose : copy.submitStart }}
          </button>
        </div>
      </section>

      <!-- ── The running package ──────────────────────────────── -->
      <section v-if="state.active" class="panel mt-6 p-6 sm:p-8">
        <h2 class="font-display text-[20px] font-bold text-ink-900">{{ copy.activeTitle }}</h2>
        <p class="mt-3 font-display text-[16px] font-bold text-ink-900">{{ state.active.package_name }}</p>
        <p class="mt-1 text-[15px] text-ink-800">
          {{ copy.perMonth(state.active.hours_per_month) }} ·
          {{ copy.monthly(euros(state.active.monthly_price)) }} ({{ copy.perHour(euros(state.active.hourly_rate)) }})
        </p>

        <p v-if="state.active.cancelled_at && state.active.effective_end_date" class="mt-4 rounded-card bg-brand-500/20 p-3 text-[14px] text-ink-900">
          {{ copy.cancelledUntil(longDate(state.active.effective_end_date)) }}
        </p>
        <p v-else-if="state.active.end_description" class="mt-4 rounded-card bg-linen p-3 text-[14px] text-ink-800">
          {{ copy.endsAfter(state.active.end_description) }}
        </p>

        <div v-if="!state.active.cancelled_at && state.active.cancel">
          <div v-if="!mode" class="mt-6 flex flex-wrap gap-3">
            <button type="button" class="btn-secondary" @click="mode = 'cancel'; actionError = ''">
              {{ state.active.end_description ? copy.changeEnd : copy.cancel }}
            </button>
            <button
              v-if="otherPackages.length"
              type="button"
              class="btn-secondary"
              @click="mode = 'change'; nextPackageId = null; actionError = ''"
            >
              {{ copy.change }}
            </button>
          </div>

          <div v-else-if="mode === 'cancel'" class="mt-6 rounded-card bg-linen p-5">
            <p class="font-display text-[16px] font-bold text-ink-900">{{ copy.cancelTitle }}</p>
            <p class="mt-2 text-[15px] text-ink-800">{{ copy.cancelBody(state.active.cancel.description) }}</p>
            <p v-if="actionError" class="field-error" role="alert">{{ actionError }}</p>
            <div class="mt-4 flex flex-wrap gap-3">
              <button type="button" class="btn-primary" :disabled="busy" @click="submitCancel">{{ copy.cancelSubmit }}</button>
              <button type="button" class="btn-secondary" :disabled="busy" @click="mode = null">{{ copy.back }}</button>
            </div>
          </div>

          <div v-else class="mt-6 rounded-card bg-linen p-5">
            <p class="font-display text-[16px] font-bold text-ink-900">{{ copy.changeTitle }}</p>
            <label for="mijn-next-package" class="field-label mt-3">{{ copy.changeLabel }}</label>
            <select id="mijn-next-package" v-model="nextPackageId" class="field-input">
              <option :value="null" disabled>{{ copy.changePlaceholder }}</option>
              <option v-for="pkg in otherPackages" :key="pkg.id" :value="pkg.id">
                {{ pkg.name }} — {{ copy.monthly(euros(pkg.monthly_price)) }}, {{ copy.perMonth(pkg.hours_per_month) }}
              </option>
            </select>
            <p v-if="nextPackageId" class="mt-3 text-[15px] text-ink-800">
              {{ copy.changeBody(state.active.cancel.description, longDate(state.active.cancel.next_package_starts)) }}
            </p>
            <p v-if="actionError" class="field-error" role="alert">{{ actionError }}</p>
            <div class="mt-4 flex flex-wrap gap-3">
              <button type="button" class="btn-primary" :disabled="busy || !nextPackageId" @click="submitChange">{{ copy.changeSubmit }}</button>
              <button type="button" class="btn-secondary" :disabled="busy" @click="mode = null">{{ copy.back }}</button>
            </div>
          </div>
        </div>
      </section>

      <!-- ── A package starting later ─────────────────────────── -->
      <p v-if="state.future" class="panel mt-4 p-5 text-[15px] text-ink-800 sm:p-6">
        {{ copy.futureTitle(state.future.package_name, longDate(state.future.started_at)) }}
        · {{ copy.monthly(euros(state.future.monthly_price)) }}
      </p>
    </template>
  </div>
</template>
