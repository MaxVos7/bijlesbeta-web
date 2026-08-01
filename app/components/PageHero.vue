<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  intro?: string
}>()
</script>

<template>
  <section class="border-b border-line-200 bg-cream">
    <div class="container-page py-16 sm:py-20">
      <p v-if="eyebrow" class="text-sm font-semibold uppercase tracking-wide text-brand-700">
        {{ eyebrow }}
      </p>
      <h1 class="mt-2 max-w-3xl text-3xl sm:text-4xl lg:text-5xl">{{ title }}</h1>
      <p v-if="intro" class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-700">
        {{ intro }}
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
