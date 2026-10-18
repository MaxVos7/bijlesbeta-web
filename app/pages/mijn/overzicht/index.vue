<script setup lang="ts">
import { mijnOverview } from '~/data/mijn'
import type { MijnLesson, MijnRecord } from '~/utils/mijn-types'

/*
  A customer's start page: what the dashboard on mijn.bijlesbeta.nl shows a
  customer, from `GET api/dashboard`. Starting or changing a package is not in
  the API yet, so those buttons still lead to the portal.
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
      confirm_url: string
    }
    future: null | { package_name: string, started_at: string }
    can_start: boolean
    manage_url: string
  }
  strip_remaining_minutes: number | null
  records: MijnRecord[]
  schedule_invite: null | { expires_at: string, url: string }
}

const api = useMijnApi()
const { user } = useMijnSession()

const overview = ref<Overview | null>(null)
const loading = ref(true)
const error = ref('')

const subscription = computed(() => overview.value?.subscription ?? null)

/** Hours as the dashboard gives them (decimal) in the site's "1 uur 30 min". */
function hours(value: number) {
  return hoursAndMinutes(Math.round(value * 60))
}

onMounted(async () => {
  try {
    overview.value = (await api<{ data: Overview }>('dashboard')).data
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
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <!-- Package -->
        <section v-if="subscription" class="panel p-6 sm:p-7">
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
            <a :href="subscription.pending.confirm_url" class="btn-primary mt-4">{{ mijnOverview.pendingCta }}</a>
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

          <a
            v-if="subscription.can_start || subscription.active"
            :href="subscription.manage_url"
            :class="subscription.can_start ? 'btn-primary' : 'btn-secondary'"
            class="mt-5"
          >
            {{ subscription.can_start ? mijnOverview.packageStart : mijnOverview.packageManage }}
          </a>
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
          <a :href="overview.schedule_invite.url" class="btn-primary mt-5">{{ mijnOverview.scheduleCta }}</a>
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
