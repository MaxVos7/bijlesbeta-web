<script setup lang="ts">
import { mijnSchedule as copy } from '~/data/mijn'

/*
  Choosing a weekly lesson slot after the office sent an invitation — the
  portal's customer schedule page, from `GET api/schedule`. Three steps: how
  it works (and for which child), the free hours per day, and the outcome.
  Laravel validates the request again (whole hour, inside the block, free).
*/
definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer'] })
useHead({ title: copy.title })

type Block = {
  id: number
  day_of_week: number
  time_start: string
  time_end: string
  provider: {
    name: string
    picture_url: string | null
    subjects: string[]
    bio: string | null
    website_url: string | null
  }
  location: null | { name: string, description: string | null, address: string | null, google_maps_link: string | null }
  taken: Array<{ start: string, end: string }>
}

type Schedule = {
  state: 'none' | 'invited' | 'used'
  outcome: 'booked' | 'no_match' | null
  expires_at: string | null
  children: Array<{ id: number, name: string }>
  blocks: Block[]
}

const DAYS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']

const api = useMijnApi()

const schedule = ref<Schedule | null>(null)
const loading = ref(true)
const error = ref('')

const step = ref<'intro' | 'list' | 'done'>('intro')
const outcome = ref<'booked' | 'no_match'>('booked')
const receiverId = ref<number | null>(null)
const openDetails = ref<number | null>(null)
const submitting = ref<string | null>(null)
const actionError = ref('')

onMounted(async () => {
  try {
    schedule.value = (await api<{ data: Schedule }>('schedule')).data
    if (schedule.value.children.length === 1) receiverId.value = schedule.value.children[0]!.id
  }
  catch (e) {
    error.value = mijnErrorMessage(e)
  }
  finally {
    loading.value = false
  }
})

const childName = computed(() => schedule.value?.children.find(c => c.id === receiverId.value)?.name ?? null)

const days = computed(() =>
  DAYS.map((label, day) => ({
    label,
    blocks: (schedule.value?.blocks ?? []).filter(b => b.day_of_week === day),
  })),
)

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h! * 60 + m!
}
const toHHMM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

/** The free whole hours in a block — the portal's `hourWindowsFor`. */
function freeHours(block: Block) {
  const end = toMin(block.time_end)
  const taken = block.taken.map(t => [toMin(t.start), toMin(t.end)] as const)
  const hours: Array<{ start: string, end: string }> = []

  for (let s = Math.ceil(toMin(block.time_start) / 60) * 60; s + 60 <= end; s += 60) {
    if (!taken.some(([ts, te]) => ts < s + 60 && te > s)) hours.push({ start: toHHMM(s), end: toHHMM(s + 60) })
  }

  return hours
}

async function request(block: Block, hour: { start: string, end: string }) {
  submitting.value = `${block.id}-${hour.start}`
  actionError.value = ''

  try {
    await api('schedule/requests', {
      method: 'POST',
      body: { block_id: block.id, receiver_id: receiverId.value, time_start: hour.start, time_end: hour.end },
    })
    outcome.value = 'booked'
    step.value = 'done'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  catch (e: any) {
    const errors: Record<string, string[]> = e?.data?.errors ?? {}
    actionError.value = Object.values(errors)[0]?.[0] ?? mijnErrorMessage(e)
  }
  finally {
    submitting.value = null
  }
}

async function noMatch() {
  submitting.value = 'no-match'
  actionError.value = ''

  try {
    await api('schedule/no-match', { method: 'POST' })
    outcome.value = 'no_match'
    step.value = 'done'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  catch (e: any) {
    const errors: Record<string, string[]> = e?.data?.errors ?? {}
    actionError.value = Object.values(errors)[0]?.[0] ?? mijnErrorMessage(e)
  }
  finally {
    submitting.value = null
  }
}
</script>

<template>
  <div class="container-page">
    <h1 class="text-[32px] leading-[44px]">{{ copy.title }}</h1>

    <p v-if="error" class="field-error mt-6" role="alert">{{ error }}</p>
    <p v-if="loading" class="mt-8 text-[15px] text-ink-700">{{ copy.loading }}</p>

    <template v-else-if="schedule">
      <!-- No invitation -->
      <div v-if="schedule.state === 'none'" class="panel mt-6 p-6 text-[15px] text-ink-800 sm:p-8">
        {{ copy.none }}
        <div class="mt-5"><NuxtLink to="/mijn/" class="btn-secondary">{{ copy.toOverview }}</NuxtLink></div>
      </div>

      <!-- Done: just now, or on an earlier visit -->
      <div v-else-if="step === 'done' || schedule.state === 'used'" class="panel mt-6 p-6 sm:p-8">
        <template v-if="(step === 'done' ? outcome : schedule.outcome) === 'no_match'">
          <h2 class="font-display text-[20px] font-bold text-ink-900">{{ copy.searchingTitle }}</h2>
          <p class="mt-2 text-[15px] leading-relaxed text-ink-800">{{ copy.searchingBody }}</p>
        </template>
        <template v-else>
          <h2 class="font-display text-[20px] font-bold text-ink-900">
            {{ step === 'done' ? copy.bookedTitle : copy.usedBookedTitle }}
          </h2>
          <p class="mt-2 text-[15px] leading-relaxed text-ink-800">{{ copy.bookedBody }}</p>
        </template>
        <div class="mt-5"><NuxtLink to="/mijn/" class="btn-secondary">{{ copy.toOverview }}</NuxtLink></div>
      </div>

      <!-- Step 1: how it works, and for whom -->
      <div v-else-if="step === 'intro'" class="panel mt-6 p-6 sm:p-8">
        <h2 class="font-display text-[20px] font-bold text-ink-900">{{ copy.howTitle }}</h2>
        <p class="mt-1 text-[15px] text-ink-700">{{ copy.howIntro }}</p>

        <ol class="mt-5 flex flex-col gap-4">
          <li v-for="(s, i) in copy.steps" :key="s.title" class="flex gap-4">
            <span class="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-500 font-display text-[14px] font-bold text-ink-900">{{ i + 1 }}</span>
            <div>
              <p class="font-display text-[15px] font-bold text-ink-900">{{ s.title }}</p>
              <p class="text-[14px] text-ink-700">{{ s.body }}</p>
            </div>
          </li>
        </ol>

        <p class="mt-6 rounded-card bg-linen p-4 text-[14px] text-ink-800">{{ copy.keepSearching }}</p>
        <p v-if="schedule.expires_at" class="mt-3 text-[14px] text-ink-700">{{ copy.validUntil(longDate(schedule.expires_at)) }}</p>

        <p v-if="!schedule.children.length" class="field-error mt-5">{{ copy.noChildren }}</p>

        <fieldset v-else-if="schedule.children.length > 1" class="mt-6">
          <legend class="font-display text-[15px] font-bold text-ink-900">{{ copy.forWhom }}</legend>
          <label v-for="child in schedule.children" :key="child.id" class="mt-2 flex items-center gap-3 text-[15px] text-ink-800">
            <input v-model="receiverId" type="radio" :value="child.id" class="accent-accent-500">
            {{ child.name }}
          </label>
        </fieldset>

        <button
          v-if="schedule.children.length"
          type="button"
          class="btn-primary mt-6"
          :disabled="receiverId === null"
          @click="step = 'list'"
        >
          {{ copy.next }}
        </button>
      </div>

      <!-- Step 2: the free hours per day -->
      <div v-else class="mt-6">
        <div class="flex flex-wrap items-center gap-4">
          <button type="button" class="btn-secondary" @click="step = 'intro'">{{ copy.back }}</button>
          <span v-if="childName" class="text-[15px] text-ink-700">{{ copy.forChild(childName) }}</span>
        </div>

        <div class="mt-5 rounded-card bg-linen p-4 text-[14px] text-ink-800">
          <p class="font-semibold">{{ copy.pickTitle }}</p>
          <p class="mt-1">{{ copy.pickBody }}</p>
        </div>

        <p v-if="actionError" class="field-error mt-4" role="alert">{{ actionError }}</p>

        <section v-for="day in days" :key="day.label" class="panel mt-4 p-5 sm:p-6">
          <h2 class="flex items-center gap-3 font-display text-[18px] font-bold text-ink-900">
            {{ day.label }}
            <span class="text-[13px] font-normal text-ink-700">{{ copy.blocksCount(day.blocks.length) }}</span>
          </h2>

          <p v-if="!day.blocks.length" class="mt-2 text-[14px] text-ink-700">{{ copy.noBlocks }}</p>

          <div v-for="block in day.blocks" :key="block.id" class="mt-4 border-t border-line-200 pt-4 first-of-type:border-t-0 first-of-type:pt-0">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="font-display text-[16px] font-bold text-ink-900">{{ block.provider.name }}</p>
                <p class="text-[13px] text-ink-700">{{ block.location?.name ?? '–' }} · {{ block.time_start }}–{{ block.time_end }}</p>
              </div>
              <button
                type="button"
                class="btn-secondary"
                :aria-expanded="openDetails === block.id"
                @click="openDetails = openDetails === block.id ? null : block.id"
              >
                {{ openDetails === block.id ? copy.hideDetails : copy.details }}
              </button>
            </div>

            <!-- Tutor and place, in place of the portal's dialog -->
            <div v-if="openDetails === block.id" class="mt-4 rounded-card bg-linen p-4">
              <div class="flex items-center gap-4">
                <img
                  v-if="block.provider.picture_url"
                  :src="block.provider.picture_url"
                  :alt="block.provider.name"
                  class="h-16 w-16 flex-none rounded-full object-cover"
                >
                <div>
                  <p class="font-display text-[16px] font-bold text-ink-900">{{ block.provider.name }}</p>
                  <p v-if="block.provider.subjects.length" class="text-[13px] text-ink-700">{{ block.provider.subjects.join(', ') }}</p>
                </div>
              </div>
              <template v-if="block.provider.bio">
                <p class="mt-4 text-[13px] font-semibold text-ink-800">{{ copy.aboutTutor }}</p>
                <p class="mt-1 text-[14px] leading-relaxed whitespace-pre-line text-ink-800">{{ block.provider.bio }}</p>
              </template>
              <template v-if="block.location">
                <p class="mt-4 text-[13px] font-semibold text-ink-800">{{ copy.location }}</p>
                <p class="mt-1 text-[14px] text-ink-900">{{ block.location.name }}</p>
                <p v-if="block.location.description" class="text-[14px] text-ink-700">{{ block.location.description }}</p>
                <p v-if="block.location.address" class="text-[13px] text-ink-700">{{ block.location.address }}</p>
                <a
                  v-if="block.location.google_maps_link"
                  :href="block.location.google_maps_link"
                  target="_blank"
                  rel="noopener"
                  class="mt-1 inline-block text-[14px] font-semibold underline"
                >{{ copy.maps }}</a>
              </template>
              <a
                v-if="block.provider.website_url"
                :href="block.provider.website_url"
                target="_blank"
                rel="noopener"
                class="mt-3 block text-[14px] font-semibold underline"
              >{{ copy.website }}</a>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
              <p v-if="!freeHours(block).length" class="text-[13px] text-ink-700">{{ copy.noHours }}</p>
              <button
                v-for="hour in freeHours(block)"
                :key="hour.start"
                type="button"
                class="rounded-btn border border-accent-500 bg-accent-500/15 px-3 py-2 font-display text-[14px] font-bold text-ink-900 transition hover:bg-accent-500 disabled:opacity-60"
                :disabled="submitting !== null"
                @click="request(block, hour)"
              >
                {{ hour.start }}–{{ hour.end }}
              </button>
            </div>
          </div>
        </section>

        <section class="panel mt-6 p-6 sm:p-8">
          <h2 class="font-display text-[18px] font-bold text-ink-900">{{ copy.noMatchTitle }}</h2>
          <p class="mt-2 text-[15px] text-ink-700">{{ copy.noMatchBody }}</p>
          <button type="button" class="btn-secondary mt-5" :disabled="submitting !== null" @click="noMatch">
            {{ copy.noMatchCta }}
          </button>
        </section>
      </div>
    </template>
  </div>
</template>
