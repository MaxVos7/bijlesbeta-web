<script setup lang="ts">
import { mijnLessons } from '~/data/mijn'

definePageMeta({ layout: 'mijn', middleware: 'mijn' })
useHead({ title: mijnLessons.title })

/** One row of `GET api/lessons` — Laravel's `LessonResource`. */
type Lesson = {
  id: number
  date: string
  time_start: string | null
  time_end: string | null
  minutes: number
  is_trial: boolean
  has_travel_allowance: boolean
  is_updatable: boolean
  receiver: { id: number, name: string }
  provider: { id: number, name: string }
  record_body: string | null
}

type Page = {
  data: Lesson[]
  meta: { page: number, per_page: number, total: number, has_more: boolean }
}

const api = useMijnApi()
const { user } = useMijnSession()

const PER_PAGE = 20

const lessons = ref<Lesson[]>([])
const total = ref(0)
const page = ref(1)
const hasMore = ref(false)
const search = ref('')
const loading = ref(true)
const loadingMore = ref(false)
const error = ref('')

// Supervisors see their tutors' lessons too, so for them the row names the tutor.
const showProvider = computed(() => !user.value?.is_provider)

async function load(nextPage = 1) {
  error.value = ''

  try {
    const result = await api<Page>('lessons', {
      query: { page: nextPage, per_page: PER_PAGE, search: search.value.trim() || undefined },
    })
    lessons.value = nextPage === 1 ? result.data : [...lessons.value, ...result.data]
    total.value = result.meta.total
    hasMore.value = result.meta.has_more
    page.value = nextPage
  }
  catch (e) {
    error.value = mijnErrorMessage(e)
  }
}

async function reload() {
  loading.value = true
  await load(1)
  loading.value = false
}

async function loadMore() {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true
  await load(page.value + 1)
  loadingMore.value = false
}

// Search as you type, but not on every keystroke.
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(reload, 300)
})

onMounted(reload)
</script>

<template>
  <div class="container-page">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="kicker">{{ mijnLessons.kicker }}</p>
        <h1 class="mt-3 text-[32px] leading-[44px]">{{ mijnLessons.title }}</h1>
        <p v-if="!loading" class="mt-1 text-[14px] text-ink-700">{{ mijnLessons.count(total) }}</p>
      </div>

      <div class="w-full sm:w-[280px]">
        <label for="mijn-lessons-search" class="sr-only">{{ mijnLessons.searchLabel }}</label>
        <input
          id="mijn-lessons-search"
          v-model="search"
          type="search"
          class="field-input mt-0"
          :placeholder="mijnLessons.searchPlaceholder"
        >
      </div>
    </div>

    <p v-if="error" class="field-error mt-6" role="alert">{{ error }}</p>

    <p v-if="loading" class="mt-8 text-[15px] text-ink-700">{{ mijnLessons.loading }}</p>

    <div v-else-if="!lessons.length && !error" class="panel mt-6 p-6 text-[15px] text-ink-700 sm:p-9">
      {{ search.trim() ? mijnLessons.emptySearch : mijnLessons.empty }}
    </div>

    <ul v-else class="mt-6 flex flex-col gap-3">
      <li v-for="lesson in lessons" :key="lesson.id" class="panel flex gap-5 p-5 sm:p-6">
        <!-- Date block, like the rail in the app. -->
        <div class="w-[92px] flex-none border-r border-line-200 pr-4">
          <p class="font-display text-[14px] leading-5 font-bold text-ink-900">{{ lessonDate(lesson.date) }}</p>
          <p v-if="lesson.time_start" class="mt-1 text-[13px] text-ink-700">
            {{ clockTime(lesson.time_start) }}<template v-if="lesson.time_end">–{{ clockTime(lesson.time_end) }}</template>
          </p>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p class="font-display text-[16px] font-bold text-ink-900">{{ lesson.receiver.name }}</p>
            <span class="text-[14px] text-ink-700">{{ hoursAndMinutes(lesson.minutes) }}</span>
            <span
              v-if="lesson.is_trial"
              class="rounded-btn bg-brand-500 px-2 py-0.5 font-display text-[12px] font-bold text-ink-900"
            >{{ mijnLessons.trial }}</span>
            <span
              v-if="lesson.has_travel_allowance"
              class="rounded-btn border border-black/10 px-2 py-0.5 font-display text-[12px] font-semibold text-ink-800"
            >{{ mijnLessons.travel }}</span>
          </div>

          <p v-if="showProvider" class="mt-1 text-[13px] text-ink-700">
            {{ mijnLessons.provider }}: {{ lesson.provider.name }}
          </p>

          <p
            v-if="lesson.record_body"
            class="mt-2 line-clamp-2 text-[14px] leading-relaxed text-ink-700"
            :title="lesson.record_body"
          >
            <span class="font-semibold text-ink-800">{{ mijnLessons.record }}:</span> {{ lesson.record_body }}
          </p>
        </div>
      </li>
    </ul>

    <div v-if="hasMore && !loading" class="mt-6 flex justify-center">
      <button type="button" class="btn-secondary" :disabled="loadingMore" @click="loadMore">
        {{ mijnLessons.more }}
      </button>
    </div>
  </div>
</template>
