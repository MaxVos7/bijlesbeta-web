<script setup lang="ts">
import { mijnChildren } from '~/data/mijn'
import type { MijnChild } from '~/utils/mijn-types'

/* A customer's children — the students on their account — from `GET api/children`. */
definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer'] })
useHead({ title: mijnChildren.title })

const api = useMijnApi()

const children = ref<MijnChild[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    children.value = (await api<{ data: MijnChild[] }>('children')).data
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
    <p class="kicker">{{ mijnChildren.kicker }}</p>
    <h1 class="mt-3 text-[32px] leading-[44px]">{{ mijnChildren.title }}</h1>

    <p v-if="error" class="field-error mt-6" role="alert">{{ error }}</p>
    <p v-if="loading" class="mt-8 text-[15px] text-ink-700">{{ mijnChildren.loading }}</p>

    <div v-else-if="!children.length && !error" class="panel mt-6 p-6 text-[15px] text-ink-700 sm:p-9">
      {{ mijnChildren.empty }}
    </div>

    <ul v-else class="mt-6 grid gap-4 md:grid-cols-2">
      <li v-for="child in children" :key="child.id">
        <NuxtLink
          :to="`/mijn/leerlingen/${child.id}/`"
          class="panel block h-full p-6 transition hover:bg-linen sm:p-7"
        >
          <div class="flex flex-wrap items-center gap-3">
            <p class="font-display text-[18px] font-bold text-ink-900">{{ child.name }}</p>
            <span
              v-if="!child.active"
              class="rounded-btn border border-black/10 px-2 py-0.5 font-display text-[12px] font-semibold text-ink-800"
            >{{ mijnChildren.inactive }}</span>
          </div>
          <p v-if="child.level || child.subjects.length" class="mt-1 text-[14px] text-ink-700">
            {{ [child.level, child.subjects.join(', ')].filter(Boolean).join(' · ') }}
          </p>
          <p class="mt-3 text-[14px] text-ink-800">
            <span class="font-semibold">{{ mijnChildren.tutors }}:</span>
            {{ child.tutors.length ? child.tutors.map(t => t.name).join(', ') : mijnChildren.noTutor }}
          </p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
