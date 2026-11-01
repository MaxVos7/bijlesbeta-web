<script setup lang="ts">
import { mijnPackages as copy } from '~/data/mijn'
import type { PackagePeriod, PackageState } from '~/utils/mijn-types'

/*
  Looking back: each period of the package with what was followed, what came
  out of the credit, and why an invoice is as high as it is. Settled periods
  show their figures; the others say when they will.
*/
definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer', 'mijn-packages'] })
useHead({ title: copy.periodsTitle })

const api = useMijnApi()

const state = ref<PackageState | null>(null)
const loading = ref(true)
const error = ref('')
const unavailable = ref(false)
const openId = ref<number | null>(null)

onMounted(async () => {
  try {
    state.value = (await api<{ data: PackageState }>('package')).data
    openId.value = rows.value[0]?.period.id ?? null
  }
  catch (e: any) {
    if ((e?.statusCode ?? e?.status) === 404) unavailable.value = true
    else error.value = mijnErrorMessage(e)
  }
  finally {
    loading.value = false
  }
})

const stateLabel = (p: PackagePeriod) => ({
  active: copy.stateRunning,
  scheduled: copy.stateScheduled,
  ended: copy.stateEnded,
  settled: copy.stateSettled,
})[p.status]

function lines(p: PackagePeriod) {
  const s = p.settlement
  if (!s) return []

  const rows = [
    { k: copy.lineHours, v: hoursLabel(p.hours) },
    { k: copy.lineUsed, v: hoursLabel(s.hours_used) },
    { k: copy.lineFromCredit, v: hoursLabel(s.hours_from_credit) },
    { k: copy.lineExtra, v: s.extra_hours > 0 ? `${hoursLabel(s.extra_hours)} · ${euros(s.extra_cents)}` : copy.lineNoExtra },
    { k: copy.lineCreditAdded, v: hoursLabel(s.credit_generated) },
  ]

  if (s.credit_capped > 0) rows.push({ k: copy.lineCapped, v: hoursLabel(s.credit_capped) })
  if (s.invoice) rows.push({ k: copy.lineSettlementInvoice, v: paymentPill(s.invoice) })
  return rows
}

/** Newest first. */
const rows = computed(() => [...(state.value?.periods ?? [])].reverse().map(period => ({ period, lines: lines(period) })))

const ceiling = computed(() => {
  const max = state.value?.credit.max_hours
  return !!max && state.value!.credit.hours >= max
})
</script>

<template>
  <div class="container-page">
    <NuxtLink to="/mijn/pakketten/" class="font-display text-[14px] font-bold">{{ copy.back }}</NuxtLink>

    <template v-if="state?.enrollment">
      <p class="kicker mt-4">{{ state.enrollment.plan.name }} · {{ copy.perPeriod(state.enrollment.plan.hours_per_period) }}</p>
    </template>
    <p v-else class="kicker mt-4">{{ copy.kicker }}</p>
    <h1 class="mt-3 text-[32px] leading-[44px]">{{ copy.periodsTitle }}</h1>
    <p class="text-ink-700">{{ copy.periodsIntro }}</p>

    <p v-if="loading" class="mt-6 text-[15px] text-ink-700">{{ copy.loading }}</p>
    <p v-else-if="unavailable" class="panel mt-6 p-6 text-[15px] text-ink-800">{{ copy.unavailable }}</p>
    <p v-else-if="error" class="field-error mt-6" role="alert">{{ error }}</p>

    <template v-else-if="state">
      <p v-if="ceiling" class="mt-6 rounded-card bg-brand-500/15 p-4 text-[14px] ring-1 ring-brand-500/50" role="note">
        {{ copy.ceilingNotice(state.credit.max_hours!) }}
      </p>
      <p class="mt-4 rounded-card bg-linen px-[18px] py-3.5 text-[14px]">{{ copy.periodsCorrection }}</p>

      <p v-if="!rows.length" class="panel mt-5 p-6 text-[15px] text-ink-800">{{ copy.periodsEmpty }}</p>

      <div class="mt-5 flex flex-col gap-3">
        <section v-for="row in rows" :key="row.period.id" class="panel">
          <button
            type="button"
            class="flex w-full flex-wrap items-center gap-4 px-6 py-5 text-left"
            :aria-expanded="openId === row.period.id"
            @click="openId = openId === row.period.id ? null : row.period.id"
          >
            <span class="min-w-[220px] flex-1">
              <span class="block font-display text-[18px] font-bold text-ink-900">{{ copy.periodTitle(row.period.position, periodRange(row.period.starts_on, row.period.ends_on)) }}</span>
              <span class="text-[14px] text-ink-700">{{ copy.periodsSub(copy.lessonWeeks(row.period.lesson_weeks), stateLabel(row.period)) }}</span>
            </span>
            <span class="font-display text-[16px] font-bold text-ink-900">{{ euros(row.period.price) }}</span>
            <MijnPill :tone="paymentTone(row.period.payment)">{{ paymentPill(row.period.payment) }}</MijnPill>
            <span aria-hidden="true" class="inline-block transition-transform" :class="openId === row.period.id ? 'rotate-180' : ''">⌄</span>
          </button>

          <div v-if="openId === row.period.id" class="px-6 pb-6">
            <p v-if="!row.period.settlement" class="rounded-card bg-linen px-[18px] py-4 text-[14px]">{{ copy.periodsPending(longDate(row.period.due_for_settlement_on)) }}</p>
            <div v-for="line in row.lines" :key="line.k" class="flex justify-between gap-4 border-t border-line-ink py-[9px] text-[14px]">
              <span class="text-ink-700">{{ line.k }}</span>
              <span class="text-right">{{ line.v }}</span>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>
