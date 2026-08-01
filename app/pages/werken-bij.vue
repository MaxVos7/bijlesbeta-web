<script setup lang="ts">
useSeoMeta({
  title: 'Werken bij Bijles Bèta',
  description:
    'Bijles geven naast je studie in Groningen. Flexibele uren, een eerlijk tarief en begeleiding vanuit een klein team.',
})

const perks = [
  {
    title: 'Flexibele uren',
    description:
      'Jij geeft aan wanneer je kunt. We plannen om je college- en tentamenrooster heen.',
  },
  {
    title: 'Een eerlijk tarief',
    description:
      'Je krijgt betaald per gegeven les, met een reiskostenvergoeding voor lessen buiten Groningen.',
  },
  {
    title: 'Klein team, kort lijntje',
    description:
      'Geen ingewikkelde structuren. Loop je ergens tegenaan, dan app je ons gewoon.',
  },
]

const requirements = [
  'Je studeert een bètaopleiding aan de Rijksuniversiteit Groningen of Hanzehogeschool.',
  'Je kunt goed uitleggen en hebt geduld met leerlingen die het even niet snappen.',
  'Je bent minimaal een half jaar beschikbaar voor een paar uur per week.',
  'Je woont in of rond Groningen, of geeft les online.',
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Werken bij"
      title="Geef bijles in het vak waar je zelf enthousiast van wordt"
      intro="Deel je kennis van wiskunde, natuurkunde of scheikunde met scholieren in Groningen — naast je eigen studie, op de uren die jou uitkomen."
    >
      <template #actions>
        <a href="#solliciteren" class="btn-primary">Solliciteer als docent</a>
      </template>
    </PageHero>

    <section class="section">
      <div class="container-page">
        <h2 class="text-2xl sm:text-3xl">Wat we bieden</h2>
        <div class="mt-10 grid gap-6 sm:grid-cols-3">
          <article
            v-for="perk in perks"
            :key="perk.title"
            class="rounded-xl border border-slate-200 p-6"
          >
            <h3 class="text-lg">{{ perk.title }}</h3>
            <p class="mt-2 leading-relaxed text-slate-600">{{ perk.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section bg-slate-50">
      <div class="container-page grid gap-12 lg:grid-cols-2">
        <div>
          <h2 class="text-2xl sm:text-3xl">Wat we vragen</h2>
          <ul class="mt-6 space-y-4">
            <li
              v-for="requirement in requirements"
              :key="requirement"
              class="flex gap-3 leading-relaxed text-slate-600"
            >
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
              {{ requirement }}
            </li>
          </ul>
        </div>

        <div id="solliciteren" class="scroll-mt-24">
          <h2 class="text-2xl sm:text-3xl">Solliciteren</h2>
          <p class="mt-4 leading-relaxed text-slate-600">
            Stuur ons een bericht met je opleiding, de vakken die je wilt geven en je
            beschikbaarheid. We nemen binnen een paar dagen contact met je op voor een
            kennismaking.
          </p>
          <ContactForm class="mt-8" subject="Sollicitatie docent" />
        </div>
      </div>
    </section>
  </div>
</template>
