<script setup lang="ts">
import { mijnChildForm, mijnChildren } from '~/data/mijn'
import type { MijnChild } from '~/utils/mijn-types'

/* Editing one of the customer's children: loads it, then hands it to the shared form. */
definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer'] })
useHead({ title: mijnChildForm.editTitle })

const route = useRoute()
const api = useMijnApi()

const child = ref<MijnChild | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const id = String(route.params.id)

  if (!/^\d+$/.test(id)) {
    error.value = mijnChildren.notFound
    loading.value = false
    return
  }

  try {
    child.value = (await api<{ data: MijnChild }>(`children/${id}`)).data
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
    <NuxtLink
      :to="child ? `/mijn/leerlingen/${child.id}/` : '/mijn/leerlingen/'"
      class="text-[14px] font-semibold text-ink-800 underline"
    >
      ← {{ child?.name ?? mijnChildren.back }}
    </NuxtLink>

    <h1 class="mt-4 text-[32px] leading-[44px]">{{ mijnChildForm.editTitle }}</h1>

    <p v-if="error" class="field-error mt-6" role="alert">{{ error }}</p>
    <p v-if="loading" class="mt-8 text-[15px] text-ink-700">{{ mijnChildForm.loading }}</p>
    <MijnChildForm v-else-if="child" :child="child" />
  </div>
</template>
