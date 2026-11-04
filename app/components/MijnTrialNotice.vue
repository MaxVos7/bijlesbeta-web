<script setup lang="ts">
import { mijnPackages } from '~/data/mijn'

/**
  Shown instead of the package picker until a trial lesson has taken place. The
  portal refuses the start as well (`needs_trial_lesson`); this explains why.
*/
const copy = mijnPackages.trial
</script>

<template>
  <section class="rounded-block bg-accent-500 p-8 sm:p-10" aria-labelledby="trial-title">
    <p class="font-display text-[14px] font-bold uppercase leading-none tracking-[0.06em] text-ink-900">{{ copy.kicker }}</p>
    <h2 id="trial-title" class="mt-3 text-[28px] leading-[44px] text-ink-900">{{ copy.title }}</h2>
    <p class="max-w-[620px] text-ink-900">{{ copy.body }}</p>

    <ol class="mt-6 grid gap-3 sm:grid-cols-3">
      <li v-for="(step, i) in copy.steps" :key="step.title" class="rounded-card bg-white p-5">
        <span class="flex size-8 items-center justify-center rounded-full bg-ink-900 font-display text-[14px] font-bold text-white" aria-hidden="true">{{ i + 1 }}</span>
        <h3 class="mt-3 text-[16px] leading-6">{{ step.title }}</h3>
        <p class="mt-1 text-[14px] text-ink-800">{{ step.body }}</p>
      </li>
    </ol>

    <p class="mt-6 text-[15px] text-ink-900">
      {{ copy.contactBefore }}
      <NuxtLink to="/contact/" class="font-semibold underline">{{ copy.contactLink }}</NuxtLink>.
    </p>
  </section>
</template>
