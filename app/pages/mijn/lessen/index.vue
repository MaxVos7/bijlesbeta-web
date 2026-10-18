<script setup lang="ts">
import { mijnLessons } from '~/data/mijn'
import type { MijnLesson } from '~/utils/mijn-types'

definePageMeta({ layout: 'mijn', middleware: 'mijn' })
useHead({ title: mijnLessons.title })

type Page = {
  data: MijnLesson[]
  meta: { page: number, per_page: number, total: number, has_more: boolean }
}

const api = useMijnApi()
const { user } = useMijnSession()

const PER_PAGE = 20

const lessons = ref<MijnLesson[]>([])
const total = ref(0)
const page = ref(1)
const hasMore = ref(false)
const search = ref('')
const loading = ref(true)
const loadingMore = ref(false)
const error = ref('')

// A tutor's own lessons need no tutor's name; a customer's or a supervisor's do.
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
      <MijnLessonRow v-for="lesson in lessons" :key="lesson.id" :lesson="lesson" :show-provider="showProvider" />
    </ul>

    <div v-if="hasMore && !loading" class="mt-6 flex justify-center">
      <button type="button" class="btn-secondary" :disabled="loadingMore" @click="loadMore">
        {{ mijnLessons.more }}
      </button>
    </div>
  </div>
</template>
