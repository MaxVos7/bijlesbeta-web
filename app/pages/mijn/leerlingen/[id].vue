<script setup lang="ts">
import { mijnChildren } from '~/data/mijn'
import type { MijnChild, MijnLesson, MijnRecord } from '~/utils/mijn-types'

/* One of a customer's children: details, lessons and shared notes, from `GET api/children/<id>`. */
definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer'] })

type ChildDetail = MijnChild & { lessons: MijnLesson[], records: MijnRecord[] }

const route = useRoute()
const api = useMijnApi()

const child = ref<ChildDetail | null>(null)
const loading = ref(true)
const error = ref('')

useHead({ title: () => child.value?.name ?? mijnChildren.title })

onMounted(async () => {
  const id = String(route.params.id)

  if (!/^\d+$/.test(id)) {
    error.value = mijnChildren.notFound
    loading.value = false
    return
  }

  try {
    child.value = (await api<{ data: ChildDetail }>(`children/${id}`)).data
  }
  catch (e: any) {
    error.value = (e?.statusCode ?? e?.status) === 404 ? mijnChildren.notFound : mijnErrorMessage(e)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container-page">
    <NuxtLink to="/mijn/leerlingen/" class="text-[14px] font-semibold text-ink-800 underline">
      ← {{ mijnChildren.back }}
    </NuxtLink>

    <p v-if="error" class="field-error mt-6" role="alert">{{ error }}</p>
    <p v-if="loading" class="mt-8 text-[15px] text-ink-700">{{ mijnChildren.loading }}</p>

    <template v-else-if="child">
      <h1 class="mt-4 text-[32px] leading-[44px]">{{ child.name }}</h1>
      <p v-if="child.level || child.subjects.length" class="mt-1 text-[15px] text-ink-700">
        {{ [child.level, child.subjects.join(', ')].filter(Boolean).join(' · ') }}
      </p>
      <p class="mt-2 text-[15px] text-ink-800">
        <span class="font-semibold">{{ mijnChildren.tutors }}:</span>
        {{ child.tutors.length ? child.tutors.map(t => t.name).join(', ') : mijnChildren.noTutor }}
      </p>

      <section class="mt-10">
        <h2 class="font-display text-[22px] font-bold text-ink-900">{{ mijnChildren.lessonsTitle }}</h2>
        <p v-if="!child.lessons.length" class="mt-4 text-[15px] text-ink-700">{{ mijnChildren.lessonsEmpty }}</p>
        <ul v-else class="mt-4 flex flex-col gap-3">
          <MijnLessonRow
            v-for="lesson in child.lessons"
            :key="lesson.id"
            :lesson="lesson"
            :show-receiver="false"
            show-provider
          />
        </ul>
      </section>

      <section v-if="child.records.length" class="mt-10">
        <h2 class="font-display text-[22px] font-bold text-ink-900">{{ mijnChildren.recordsTitle }}</h2>
        <MijnRecordList class="mt-4" :records="child.records" />
      </section>
    </template>
  </div>
</template>
