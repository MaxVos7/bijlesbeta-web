<script setup lang="ts">
import { mijnPackages as copy } from '~/data/mijn'
import type { PackageState } from '~/utils/mijn-types'

/*
  How packages with periods work. Static copy (`mijnPackages.explain`); the
  only live part is the line about the customer's own package, when there is
  one, which is read from the same call as the package page.
*/
definePageMeta({ layout: 'mijn', middleware: ['mijn', 'mijn-customer'] })

const text = copy.explain
useHead({ title: text.title })

const api = useMijnApi()
const state = ref<PackageState | null>(null)
const openFaq = ref(-1)

onMounted(async () => {
  try {
    state.value = (await api<{ data: PackageState }>('package')).data
  }
  catch {
    // The explanation stands without it.
  }
})

const plan = computed(() => state.value?.enrollment?.plan ?? null)

const cellClass = {
  les: 'bg-accent-500 text-ink-900',
  off: 'border border-dashed border-ink-900/20 bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgb(29_29_27/0.14)_6px_8px)] text-ink-900/60',
  nieuw: 'border border-ink-900/10 bg-sand',
}

const blockClass = {
  used: 'border-2 border-accent-500 bg-accent-500',
  empty: 'border-2 border-accent-500',
  credit: 'border-2 border-dashed border-accent-500 bg-accent-500/55',
  extra: 'border-2 border-ink-900 bg-ink-900',
}
</script>

<template>
  <div class="container-page">
    <div class="mx-auto flex max-w-[760px] flex-col gap-16 leading-[1.75]">
      <header class="flex flex-col gap-4">
        <NuxtLink to="/mijn/pakketten/" class="font-display text-[14px] font-bold">{{ copy.back }}</NuxtLink>
        <p class="kicker">{{ text.kicker }}</p>
        <h1 class="text-[32px] leading-[44px]">{{ text.title }}</h1>
        <p class="max-w-[60ch] text-[18px]">{{ text.intro }}</p>
        <p v-if="plan" class="rounded-card bg-linen px-5 py-4 text-[15px]">
          {{ text.yours(plan.name, plan.hours_per_period, euros(plan.price), euros(plan.extra_hour_price)) }}
        </p>
      </header>

      <section class="flex flex-col gap-5">
        <h2 class="text-[28px] leading-[44px]">{{ text.stepsTitle }}</h2>
        <ol class="grid gap-3">
          <li v-for="(step, i) in text.steps" :key="step.t" class="panel grid grid-cols-[40px_1fr] gap-x-4 gap-y-1 p-5">
            <span class="row-span-2 grid size-10 place-items-center rounded-full bg-accent-500 font-display text-[16px] font-extrabold text-ink-900">{{ i + 1 }}</span>
            <h3 class="font-display text-[17px] font-bold">{{ step.t }}</h3>
            <p>{{ step.p }}</p>
          </li>
        </ol>
      </section>

      <section class="flex flex-col gap-5">
        <h2 class="text-[28px] leading-[44px]">{{ text.holidayTitle }}</h2>
        <p class="max-w-[62ch]">{{ text.holidayBody }}</p>
        <div class="flex flex-col gap-4 rounded-block bg-white p-6 shadow-panel">
          <div v-for="row in text.weekRows" :key="row.label" class="flex flex-col gap-2">
            <span class="font-display text-[14px] font-bold">{{ row.label }}</span>
            <div class="grid grid-cols-5 gap-1.5">
              <div
                v-for="(cell, i) in row.cells"
                :key="i"
                class="rounded-[4px] px-1 py-2.5 text-center text-[13px] font-semibold leading-[1.3]"
                :class="[cellClass[cell[2] as keyof typeof cellClass], cell[2] === 'off' && cell[0] === 'Zomervakantie' ? 'col-span-2' : '']"
              >
                {{ cell[0] }}
                <small v-if="cell[1]" class="block text-[11px] font-normal">{{ cell[1] }}</small>
              </div>
            </div>
            <p v-if="row.cap" class="text-[14px] text-ink-700">{{ row.cap }}</p>
          </div>
        </div>
        <h3 class="font-display text-[17px] font-bold">{{ text.summerTitle }}</h3>
        <p class="max-w-[62ch]">{{ text.summerBody }}</p>
      </section>

      <section class="flex flex-col gap-5">
        <h2 class="text-[28px] leading-[44px]">{{ text.hoursTitle }}</h2>
        <p class="max-w-[62ch]">{{ text.hoursBody }}</p>
        <div class="grid gap-3 sm:grid-cols-3">
          <div v-for="o in text.outcomes" :key="o.t" class="panel p-5">
            <h3 class="font-display text-[17px] font-bold">{{ o.t }}</h3>
            <p class="mt-1.5">{{ o.p }}</p>
          </div>
        </div>
        <div class="flex flex-col gap-5 rounded-block bg-white p-6 shadow-panel">
          <span class="font-display text-[14px] font-bold">{{ text.exampleTitle }}</span>
          <div v-for="ex in text.examples" :key="ex.t" class="flex flex-col gap-2.5">
            <div class="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <h3 class="font-display text-[17px] font-bold">{{ ex.t }}</h3>
              <span class="text-[14px] text-ink-700">{{ ex.c }}</span>
            </div>
            <div class="flex flex-wrap gap-[5px]">
              <span v-for="(b, i) in ex.blocks" :key="i" class="size-7 rounded-[4px]" :class="blockClass[b as keyof typeof blockClass]" />
            </div>
            <p class="text-[15px]">{{ ex.res }}</p>
          </div>
          <div class="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-700">
            <span v-for="[kind, label] in text.legend" :key="kind" class="inline-flex items-center gap-2">
              <i class="size-3.5 rounded-[4px]" :class="blockClass[kind as keyof typeof blockClass]" />{{ label }}
            </span>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-5">
        <h2 class="text-[28px] leading-[44px]">{{ text.creditTitle }}</h2>
        <p v-for="p in text.creditBody" :key="p" class="max-w-[62ch]">{{ p }}</p>
        <p class="text-[14px] text-ink-700">{{ text.creditNote }}</p>
      </section>

      <section class="flex flex-col gap-5">
        <h2 class="text-[28px] leading-[44px]">{{ text.invoicesTitle }}</h2>
        <div class="grid gap-3 sm:grid-cols-3">
          <div v-for="inv in text.invoices" :key="inv.t" class="panel flex flex-col gap-2 p-6">
            <span class="self-start rounded-full border border-line-ink bg-sand px-2.5 py-0.5 font-display text-[12px] font-bold uppercase leading-[1.6] tracking-[0.06em]">{{ inv.tag }}</span>
            <h3 class="font-display text-[17px] font-bold">{{ inv.t }}</h3>
            <p>{{ inv.p }}</p>
          </div>
        </div>
        <p class="max-w-[62ch]">{{ text.invoicesNote }}</p>
      </section>

      <section class="flex flex-col gap-5">
        <h2 class="text-[28px] leading-[44px]">{{ text.looseTitle }}</h2>
        <p class="max-w-[62ch]">{{ text.looseBody }}</p>
      </section>

      <section class="flex flex-col gap-5">
        <h2 class="text-[28px] leading-[44px]">{{ text.faqTitle }}</h2>
        <div class="border-t border-ink-900/10">
          <div v-for="(item, i) in text.faq" :key="item[0]" class="border-b border-ink-900/10">
            <button
              type="button"
              class="flex w-full justify-between gap-4 py-[18px] text-left font-display text-[16px] font-bold"
              :aria-expanded="openFaq === i"
              @click="openFaq = openFaq === i ? -1 : i"
            >
              <span>{{ item[0] }}</span>
              <span class="text-[22px] leading-none text-brand-700">{{ openFaq === i ? '−' : '+' }}</span>
            </button>
            <p v-if="openFaq === i" class="max-w-[62ch] pb-5">{{ item[1] }}</p>
          </div>
        </div>
      </section>

      <aside class="flex flex-col items-start gap-3.5 rounded-block bg-accent-500 px-7 py-9">
        <h2 class="text-[28px] leading-[44px] text-ink-900">{{ text.closingTitle }}</h2>
        <p class="text-ink-900">{{ text.closingBody }}</p>
        <NuxtLink to="/mijn/pakketten/" class="btn btn-lg bg-ink-900 text-white">{{ copy.toPackage }}</NuxtLink>
      </aside>
    </div>
  </div>
</template>
