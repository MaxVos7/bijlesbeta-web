<script setup lang="ts">
import { mijnChildForm } from '~/data/mijn'

definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer'] })
useHead({ title: mijnChildForm.addTitle })
</script>

<template>
  <div class="container-page">
    <NuxtLink to="/mijn/leerlingen/" class="text-[14px] font-semibold text-ink-800 underline">← Alle leerlingen</NuxtLink>
    <h1 class="mt-4 text-[32px] leading-[44px]">{{ mijnChildForm.addTitle }}</h1>
    <MijnChildForm />
  </div>
</template>
