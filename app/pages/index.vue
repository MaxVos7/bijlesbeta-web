<script setup lang="ts">
import { pricingPlans, subjects } from '~/data/site'

useSeoMeta({
  title: 'Bijles in wiskunde, natuurkunde en scheikunde in Groningen',
  description:
    'Persoonlijke bijles van bètastudenten van de RUG. Altijd een match met de juiste docent, en je eerste les is gratis.',
})

const steps = [
  {
    title: 'Je meldt je aan',
    description:
      'Vertel ons welk vak, welk niveau en wanneer het uitkomt. Dat kost een minuut.',
  },
  {
    title: 'Wij zoeken de match',
    description:
      'Meestal hebben we binnen vijf dagen een docent gevonden die bij je past.',
  },
  {
    title: 'Gratis proefles',
    description:
      'Je eerste les is gratis en vrijblijvend. Klikt het niet? Dan zoeken we verder.',
  },
]

const cheapestPlan = pricingPlans.reduce((low, plan) => (plan.price < low.price ? plan : low))
</script>

<template>
  <div>
    <PageHero
      eyebrow="Bijles in Groningen"
      title="Altijd een persoonlijke match met de juiste docent"
      intro="Wiskunde, natuurkunde en scheikunde, één op één uitgelegd door enthousiaste bètastudenten van de Rijksuniversiteit Groningen. Je eerste les is gratis."
    >
      <template #actions>
        <NuxtLink to="/aanmelden" class="btn-primary">Plan een gratis proefles</NuxtLink>
        <NuxtLink to="/tarieven" class="btn-secondary">Bekijk de tarieven</NuxtLink>
      </template>
    </PageHero>

    <section class="section">
      <div class="container-page">
        <h2 class="text-2xl sm:text-3xl">Waar we bijles in geven</h2>
        <p class="mt-3 max-w-2xl text-slate-600">
          Onze docenten studeren zelf de vakken die ze uitleggen. Zo weten ze precies waar de
          stof lastig wordt.
        </p>

        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="subject in subjects"
            :key="subject.slug"
            class="rounded-xl border border-slate-200 p-6 transition hover:border-brand-300 hover:shadow-sm"
          >
            <h3 class="text-lg">{{ subject.name }}</h3>
            <p class="mt-2 leading-relaxed text-slate-600">{{ subject.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section bg-slate-50">
      <div class="container-page">
        <h2 class="text-2xl sm:text-3xl">Zo werkt het</h2>

        <ol class="mt-10 grid gap-8 sm:grid-cols-3">
          <li v-for="(step, index) in steps" :key="step.title">
            <span
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white"
            >
              {{ index + 1 }}
            </span>
            <h3 class="mt-4 text-lg">{{ step.title }}</h3>
            <p class="mt-2 leading-relaxed text-slate-600">{{ step.description }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 class="text-2xl sm:text-3xl">Eerlijke prijzen, geen servicekosten</h2>
          <p class="mt-4 leading-relaxed text-slate-600">
            Bijles Bèta wordt gerund door studenten, en dat zie je terug in het tarief. Je
            betaalt per maand, achteraf, voor de lessen die daadwerkelijk zijn gegeven.
          </p>
          <p class="mt-4 leading-relaxed text-slate-600">
            Neem je meer uren af, dan zakt het uurtarief tot
            <strong class="text-slate-900">€{{ cheapestPlan.price }} per uur</strong>.
          </p>
          <NuxtLink to="/tarieven" class="btn-primary mt-8">Bekijk alle pakketten</NuxtLink>
        </div>

        <dl class="grid gap-6 sm:grid-cols-2">
          <div class="rounded-xl border border-slate-200 p-6">
            <dt class="text-sm font-medium text-slate-500">Docenten</dt>
            <dd class="mt-1 text-3xl font-semibold text-slate-900">30+</dd>
            <p class="mt-2 text-sm text-slate-600">Allemaal bètastudenten aan de RUG.</p>
          </div>
          <div class="rounded-xl border border-slate-200 p-6">
            <dt class="text-sm font-medium text-slate-500">Gemiddelde matchtijd</dt>
            <dd class="mt-1 text-3xl font-semibold text-slate-900">5 dagen</dd>
            <p class="mt-2 text-sm text-slate-600">Van aanmelding tot je eerste les.</p>
          </div>
          <div class="rounded-xl border border-slate-200 p-6">
            <dt class="text-sm font-medium text-slate-500">Proefles</dt>
            <dd class="mt-1 text-3xl font-semibold text-slate-900">Gratis</dd>
            <p class="mt-2 text-sm text-slate-600">Vrijblijvend, zonder verplichtingen.</p>
          </div>
          <div class="rounded-xl border border-slate-200 p-6">
            <dt class="text-sm font-medium text-slate-500">Vanaf</dt>
            <dd class="mt-1 text-3xl font-semibold text-slate-900">
              €{{ cheapestPlan.price }}
            </dd>
            <p class="mt-2 text-sm text-slate-600">Per uur bij het pakket Uitgebreid.</p>
          </div>
        </dl>
      </div>
    </section>

    <section class="section bg-slate-50">
      <div class="container-page max-w-3xl">
        <h2 class="text-2xl sm:text-3xl">Veelgestelde vragen</h2>
        <FaqList class="mt-8" :limit="4" />
        <NuxtLink to="/contact" class="btn-secondary mt-8">
          Staat je vraag er niet bij?
        </NuxtLink>
      </div>
    </section>

    <section class="bg-brand-700">
      <div class="container-page py-16 text-center">
        <h2 class="text-2xl text-white sm:text-3xl">Begin met een gratis proefles</h2>
        <p class="mx-auto mt-3 max-w-xl text-brand-100">
          Vertel ons wat je nodig hebt. Wij zoeken de docent erbij.
        </p>
        <NuxtLink
          to="/aanmelden"
          class="btn mt-8 bg-white text-brand-700 hover:bg-brand-50"
        >
          Aanmelden
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
