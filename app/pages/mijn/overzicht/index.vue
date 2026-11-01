<script setup lang="ts">
import { mijnOverview } from '~/data/mijn'
import { mijnPackages } from '~/data/mijn'
import type { MijnChild, MijnLesson, MijnRecord, PackageDashboard } from '~/utils/mijn-types'

/*
  A customer's start page: what the dashboard on mijn.bijlesbeta.nl shows a
  customer, from `GET api/dashboard`. Package actions live on /mijn/pakket/.
*/
definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer'] })
useHead({ title: mijnOverview.title })

type Overview = {
  recent_lessons: MijnLesson[]
  subscription: null | {
    active: null | {
      package_name: string
      monthly_price: number
      hours_per_month: number
      end_description: string | null
      period: {
        month_name: string
        available_hours: number
        hours_used: number
        remaining_hours: number
        extra_hours: number
      }
    }
    pending: null | {
      package_name: string
      monthly_price: number
      hours_per_month: number
      suggested_by_name: string
    }
    future: null | { package_name: string, started_at: string }
    can_start: boolean
  }
  /** Packages with periods; null while that feature is off. */
  package: PackageDashboard | null
  strip_remaining_minutes: number | null
  records: MijnRecord[]
  schedule_invite: null | { expires_at: string, url: string }
}

const api = useMijnApi()
const { user } = useMijnSession()

const overview = ref<Overview | null>(null)
const loading = ref(true)
const error = ref('')

// Until a tutor is connected to one of the children there is nothing else to
// look at yet, so the page says what happens next. A failed lookup shows
// nothing rather than a welcome to somebody who may already have a tutor.
const waitingForTutor = ref(false)

const subscription = computed(() => overview.value?.subscription ?? null)
const pkg = computed(() => overview.value?.package ?? null)
const pkgUsage = computed(() => pkg.value?.period?.usage ?? null)
/** What is left of the package and the credit, as the package page counts it. */
const pkgLeft = computed(() => (pkgUsage.value ? Math.max(0, pkgUsage.value.hours + pkgUsage.value.credit - pkgUsage.value.used) : 0))
const pkgPending = computed(() => pkg.value?.enrollment?.status === 'pending' ? pkg.value.enrollment : null)

// A customer on the new system has no use for the old card's "choose a package" prompt.
const showSubscription = computed(() => !!subscription.value && !pkg.value?.enrollment)

/** Hours as the dashboard gives them (decimal) in the site's "1 uur 30 min". */
function hours(value: number) {
  return hoursAndMinutes(Math.round(value * 60))
}

onMounted(async () => {
  try {
    const [dashboard, children] = await Promise.all([
      api<{ data: Overview }>('dashboard'),
      api<{ data: MijnChild[] }>('children').catch(() => null),
    ])
    overview.value = dashboard.data
    waitingForTutor.value = !!children && !children.data.some((child) => child.tutors.length)
  }
  catch (e) {
    error.value = mijnErrorMessage(e)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container-page">
    <h1 class="text-[32px] leading-[44px]">{{ mijnOverview.greeting(user?.name ?? '') }}</h1>

    <p v-if="error" class="field-error mt-6" role="alert">{{ error }}</p>
    <p v-if="loading" class="mt-8 text-[15px] text-ink-700">{{ mijnOverview.loading }}</p>

    <template v-else-if="overview">
      <section v-if="user?.has_password === false" class="panel mt-6 flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <h2 class="font-display text-[18px] font-bold text-ink-900">{{ mijnOverview.passwordTitle }}</h2>
          <p class="mt-1 text-[14px] leading-relaxed text-ink-700">{{ mijnOverview.passwordBody }}</p>
        </div>
        <NuxtLink to="/mijn/wachtwoord/" class="btn-primary shrink-0">{{ mijnOverview.passwordCta }}</NuxtLink>
      </section>

      <section v-if="waitingForTutor" class="panel mt-6 p-6 sm:p-7">
        <h2 class="font-display text-[22px] font-bold text-ink-900">{{ mijnOverview.welcomeTitle }}</h2>
        <p class="mt-3 text-[15px] leading-relaxed text-ink-800">{{ mijnOverview.welcomeBody }}</p>
        <ol class="mt-5 grid gap-3">
          <li
            v-for="step in mijnOverview.welcomeSteps"
            :key="step.title"
            class="rounded-card bg-linen p-4"
          >
            <p class="font-display text-[15px] font-bold text-ink-900">{{ step.title }}</p>
            <p class="mt-1 text-[14px] leading-relaxed text-ink-700">{{ step.body }}</p>
          </li>
        </ol>
        <p class="mt-5 text-[14px] text-ink-700">{{ mijnOverview.welcomeContact }}</p>
      </section>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <!-- Package -->
        <section v-if="showSubscription && subscription" class="panel p-6 sm:p-7">
          <h2 class="font-display text-[18px] font-bold text-ink-900">{{ mijnOverview.packageTitle }}</h2>

          <!-- A tutor's suggestion waiting for the customer comes first: it asks something of them. -->
          <div v-if="subscription.pending" class="mt-4 rounded-card bg-linen p-4">
            <p class="font-display text-[15px] font-bold text-ink-900">
              {{ mijnOverview.pendingTitle(subscription.pending.suggested_by_name) }}
            </p>
            <p class="mt-1 text-[14px] text-ink-700">
              {{ subscription.pending.package_name }} · {{ euros(subscription.pending.monthly_price) }}/maand ·
              {{ mijnOverview.perMonth(subscription.pending.hours_per_month) }}
            </p>
            <NuxtLink to="/mijn/pakket/" class="btn-primary mt-4">{{ mijnOverview.pendingCta }}</NuxtLink>
          </div>

          <template v-if="subscription.active">
            <p class="mt-4 font-display text-[16px] font-bold text-ink-900">{{ subscription.active.package_name }}</p>
            <p class="mt-1 text-[14px] text-ink-700">
              {{ euros(subscription.active.monthly_price) }}/maand · {{ mijnOverview.perMonth(subscription.active.hours_per_month) }}
            </p>
            <p v-if="subscription.active.end_description" class="mt-1 text-[14px] text-ink-700">
              {{ subscription.active.end_description }}
            </p>

            <p class="mt-5 text-[13px] font-semibold text-ink-800 first-letter:uppercase">
              {{ mijnOverview.packageMonth(subscription.active.period.month_name) }}
            </p>
            <dl class="mt-2 grid grid-cols-2 gap-3 text-[14px] sm:grid-cols-3">
              <div>
                <dt class="text-ink-700">{{ mijnOverview.hoursUsed }}</dt>
                <dd class="font-display font-bold text-ink-900">{{ hours(subscription.active.period.hours_used) }}</dd>
              </div>
              <div>
                <dt class="text-ink-700">{{ mijnOverview.hoursRemaining }}</dt>
                <dd class="font-display font-bold text-ink-900">{{ hours(subscription.active.period.remaining_hours) }}</dd>
              </div>
              <div v-if="subscription.active.period.extra_hours > 0">
                <dt class="text-ink-700">{{ mijnOverview.hoursExtra }}</dt>
                <dd class="font-display font-bold text-ink-900">{{ hours(subscription.active.period.extra_hours) }}</dd>
              </div>
            </dl>
          </template>

          <p v-if="subscription.future" class="mt-4 text-[14px] text-ink-700">
            {{ mijnOverview.futureTitle(subscription.future.package_name, longDate(subscription.future.started_at)) }}
          </p>

          <p
            v-if="!subscription.active && !subscription.pending && !subscription.future"
            class="mt-4 text-[14px] text-ink-700"
          >
            {{ mijnOverview.packageNone }}
          </p>

          <NuxtLink
            v-if="subscription.can_start || subscription.active"
            to="/mijn/pakket/"
            :class="subscription.can_start ? 'btn-primary' : 'btn-secondary'"
            class="mt-5"
          >
            {{ subscription.can_start ? mijnOverview.packageStart : mijnOverview.packageManage }}
          </NuxtLink>
        </section>

        <!-- Package with periods ("Pakket (nieuw)") -->
        <section v-if="user?.package_periods && pkg && (pkg.enrollment || pkg.can_start)" class="panel flex flex-col gap-3.5 p-6 sm:p-7">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="font-display text-[14px] font-bold uppercase leading-none tracking-[0.06em] text-brand-700">
              {{ pkg.enrollment ? `${pkg.enrollment.plan.name} · ${pkg.enrollment.plan.hours_per_period} uur` : mijnOverview.packageNewKicker }}
            </p>
            <MijnPill v-if="pkgPending" tone="open">{{ mijnPackages.pill.pending }}</MijnPill>
            <MijnPill v-else-if="pkg.period" :tone="paymentTone(pkg.period.payment)">{{ paymentPill(pkg.period.payment) }}</MijnPill>
          </div>

          <!-- A tutor's suggestion waiting for the customer comes first: it asks something of them. -->
          <template v-if="pkgPending">
            <h2 class="font-display text-[20px] font-bold leading-[30px] text-ink-900">{{ mijnOverview.packageNewSuggest(pkgPending.suggested_by_name) }}</h2>
            <p class="text-[14px] text-ink-700">{{ pkgPending.plan.name }} · {{ euros(pkgPending.plan.price) }}/periode · {{ mijnPackages.perPeriod(pkgPending.plan.hours_per_period) }}</p>
          </template>
          <template v-else-if="pkg.enrollment">
            <h2 class="font-display text-[20px] font-bold leading-[30px] text-ink-900">
              <template v-if="pkg.period">{{ mijnPackages.periodTitle(pkg.period.position, periodRange(pkg.period.starts_on, pkg.period.ends_on)) }}</template>
              <template v-else>{{ mijnPackages.pill.pending }}</template>
            </h2>

            <div v-if="pkg.period && pkgUsage && pkg.period.status === 'active'">
              <div class="mb-2 flex justify-between gap-2 text-[14px]">
                <b class="font-display text-ink-900">{{ mijnOverview.packageNewUsed(hours(pkgUsage.used)) }}</b>
                <span class="text-ink-700">{{ pkgLeft > 0 ? `${hours(pkgLeft)} over` : '' }}</span>
              </div>
              <MijnHourBlocks :used="pkgUsage.used" :hours="pkgUsage.hours" :credit="pkgUsage.credit" :label="mijnOverview.packageNewUsed(hours(pkgUsage.used))" />
            </div>
            <p v-else-if="pkg.period" class="text-[14px] text-ink-800">{{ mijnPackages.futureTitle(longDate(pkg.period.starts_on)) }}</p>
          </template>
          <template v-else>
            <h2 class="font-display text-[20px] font-bold leading-[30px] text-ink-900">{{ mijnOverview.packageNewNone }}</h2>
          </template>

          <NuxtLink :to="pkg.enrollment ? '/mijn/pakketten/' : '/mijn/pakketten/kiezen/'" class="btn-primary mt-auto self-start">
            {{ pkgPending ? mijnOverview.pendingCta : pkg.enrollment ? mijnOverview.packageNewOpen : mijnOverview.packageNewStart }}
          </NuxtLink>
        </section>

        <!-- Strips -->
        <section v-if="overview.strip_remaining_minutes !== null" class="panel p-6 sm:p-7">
          <h2 class="font-display text-[18px] font-bold text-ink-900">{{ mijnOverview.stripTitle }}</h2>
          <p class="mt-4 text-[15px] text-ink-800">
            {{ mijnOverview.stripRemaining(hoursAndMinutes(overview.strip_remaining_minutes)) }}
          </p>
        </section>

        <!-- Schedule invitation -->
        <section v-if="overview.schedule_invite" class="panel p-6 sm:p-7">
          <h2 class="font-display text-[18px] font-bold text-ink-900">{{ mijnOverview.scheduleTitle }}</h2>
          <p class="mt-3 text-[14px] leading-relaxed text-ink-700">
            {{ mijnOverview.scheduleBody(longDate(overview.schedule_invite.expires_at)) }}
          </p>
          <NuxtLink to="/mijn/rooster/" class="btn-primary mt-5">{{ mijnOverview.scheduleCta }}</NuxtLink>
        </section>
      </div>

      <!-- Recent lessons -->
      <section class="mt-10">
        <div class="flex items-end justify-between gap-4">
          <h2 class="font-display text-[22px] font-bold text-ink-900">{{ mijnOverview.lessonsTitle }}</h2>
          <NuxtLink to="/mijn/lessen/" class="text-[14px] font-semibold text-ink-800 underline">
            {{ mijnOverview.lessonsAll }}
          </NuxtLink>
        </div>
        <p v-if="!overview.recent_lessons.length" class="mt-4 text-[15px] text-ink-700">{{ mijnOverview.lessonsEmpty }}</p>
        <ul v-else class="mt-4 flex flex-col gap-3">
          <MijnLessonRow v-for="lesson in overview.recent_lessons" :key="lesson.id" :lesson="lesson" show-provider />
        </ul>
      </section>

      <!-- Shared notes -->
      <section v-if="overview.records.length" class="mt-10">
        <h2 class="font-display text-[22px] font-bold text-ink-900">{{ mijnOverview.recordsTitle }}</h2>
        <MijnRecordList class="mt-4" :records="overview.records" show-person />
      </section>
    </template>
  </div>
</template>
