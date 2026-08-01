<script setup lang="ts">
import { pricingPlans } from '~/data/site'

useSeoMeta({
  title: 'Tarieven',
  description:
    'Bijles vanaf €25 per uur. Geen servicekosten, een gratis proefles en maandelijkse facturatie achteraf.',
})

const formatPrice = (value: number) =>
  value % 1 === 0 ? `€${value}` : `€${value.toFixed(2).replace('.', ',')}`

const conditions = [
  'Je kunt altijd meer bijles afnemen dan in het pakket zit, tegen hetzelfde uurtarief.',
  'Ongebruikte uren schuiven kosteloos door naar de volgende maand.',
  'We factureren per maand, achteraf, op basis van de gegeven lessen.',
  'Afzeggen kan kosteloos tot 24 uur voor de les.',
  'Voor lessen buiten Groningen rekenen we €5 reiskosten per les.',
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Tarieven"
      title="Eerlijke prijzen, door studenten bepaald"
      intro="Hoe meer uren je per maand afneemt, hoe lager het uurtarief. Geen inschrijfgeld, geen servicekosten."
    >
      <template #actions>
        <NuxtLink to="/aanmelden" class="btn-primary">Start met een gratis proefles</NuxtLink>
      </template>
    </PageHero>

    <section class="section">
      <div class="container-page">
        <div class="grid gap-6 lg:grid-cols-4">
          <article
            v-for="plan in pricingPlans"
            :key="plan.slug"
            class="flex flex-col rounded-xl border p-6"
            :class="
              plan.featured
                ? 'border-brand-600 shadow-md ring-1 ring-brand-600'
                : 'border-slate-200'
            "
          >
            <div class="flex items-start justify-between gap-2">
              <h2 class="text-lg">{{ plan.name }}</h2>
              <span
                v-if="plan.featured"
                class="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white"
              >
                Populair
              </span>
            </div>

            <p class="mt-1 text-sm text-slate-500">{{ plan.hoursLabel }}</p>

            <p class="mt-6 flex items-baseline gap-2">
              <span class="text-4xl font-semibold text-slate-900">
                {{ formatPrice(plan.price) }}
              </span>
              <span class="text-sm text-slate-500">per uur</span>
            </p>

            <p v-if="plan.savingsLabel" class="mt-2 text-sm font-medium text-brand-700">
              {{ plan.savingsLabel }}
              <span class="ml-1 font-normal text-slate-400 line-through">
                {{ formatPrice(plan.regularPrice) }}
              </span>
            </p>

            <ul class="mt-6 flex-1 space-y-3">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex gap-2 text-sm text-slate-600"
              >
                <svg
                  class="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {{ feature }}
              </li>
            </ul>

            <NuxtLink
              to="/aanmelden"
              class="mt-8"
              :class="plan.featured ? 'btn-primary' : 'btn-secondary'"
            >
              Kies {{ plan.name }}
            </NuxtLink>
          </article>
        </div>

        <p class="mt-8 text-sm text-slate-500">
          Alle tarieven zijn inclusief btw en gelden voor wiskunde, natuurkunde en scheikunde.
        </p>
      </div>
    </section>

    <section class="section bg-slate-50">
      <div class="container-page grid gap-12 lg:grid-cols-2">
        <div>
          <h2 class="text-2xl sm:text-3xl">Goed om te weten</h2>
          <ul class="mt-6 space-y-4">
            <li
              v-for="condition in conditions"
              :key="condition"
              class="flex gap-3 leading-relaxed text-slate-600"
            >
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
              {{ condition }}
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl">Vragen over de tarieven</h2>
          <FaqList class="mt-6" />
        </div>
      </div>
    </section>
  </div>
</template>
