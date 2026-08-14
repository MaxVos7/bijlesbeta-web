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
      <p v-if="eyebrow" class="kicker">
        {{ eyebrow }}
      </p>
      <!-- The live H1 is 32px/44px, stepping to 26px below 768px — the same
           headline the bespoke heroes use, so this one matches rather than
           running away on the Tailwind scale. -->
      <h1 class="mt-2 max-w-3xl text-[26px] leading-[44px] md:text-[32px]">{{ title }}</h1>
      <p v-if="intro" class="mt-5 max-w-2xl text-base leading-[28px] text-ink-700">
        {{ intro }}
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
