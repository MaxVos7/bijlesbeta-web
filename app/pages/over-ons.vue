<script setup lang="ts">
useSeoMeta({
  title: 'Over ons',
  description:
    'Bijles Bèta is opgericht door bètastudenten uit Groningen die hun enthousiasme voor wiskunde, natuurkunde en scheikunde willen delen.',
})

const principles = [
  {
    title: 'Persoonlijk contact',
    description:
      'We kennen onze leerlingen, ouders en docenten persoonlijk. Daardoor kunnen we flexibel zijn en snel schakelen als er iets verandert.',
  },
  {
    title: 'Efficiënt en snel',
    description:
      'Een kleine organisatie zonder ingewikkelde structuren. Contact loopt via mail, telefoon of WhatsApp, en dat houdt de kosten laag.',
  },
  {
    title: 'Een fijne leeromgeving',
    description:
      'Leerlingen leren het beste als ze zich op hun gemak voelen. Daar draait de match tussen leerling en docent om.',
  },
]

const studies = [
  'Natuurkunde',
  'Wiskunde',
  'Scheikunde',
  'Sterrenkunde',
  'Technische opleidingen',
  'Life Sciences',
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Over ons"
      title="Samen een passie voor Bèta"
      intro="Bijles Bèta is opgericht door ambitieuze studenten met een duidelijk doel: hun enthousiasme voor de bètavakken delen met Groningen."
    />

    <section class="section">
      <div class="container-page grid gap-12 lg:grid-cols-2">
        <div class="prose-page">
          <h2 class="text-2xl">Ons verhaal</h2>
          <p class="mt-4">
            Wat begon als een handjevol studenten dat medescholieren hielp met wiskunde, is
            uitgegroeid tot een team van meer dan dertig docenten. Wat hetzelfde bleef, is de
            aanpak: één op één begeleiding, door iemand die het vak zelf studeert en er
            enthousiast over is.
          </p>
          <p>
            We geloven dat een goede match het verschil maakt. Niet alleen op vakinhoud, maar
            ook qua persoon. Daarom koppelen we handmatig, en niet via een algoritme.
          </p>
        </div>

        <div class="prose-page">
          <h2 class="text-2xl">Onze aanpak</h2>
          <dl class="mt-4 space-y-6">
            <div v-for="principle in principles" :key="principle.title">
              <dt class="font-semibold text-slate-900">{{ principle.title }}</dt>
              <dd class="mt-1 leading-relaxed text-slate-600">{{ principle.description }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <section class="section bg-slate-50">
      <div class="container-page">
        <h2 class="text-2xl sm:text-3xl">Ons team</h2>
        <p class="mt-3 max-w-2xl text-slate-600">
          Al onze docenten zijn bètastudenten aan de Rijksuniversiteit Groningen. Ze studeren
          onder andere:
        </p>

        <ul class="mt-8 flex flex-wrap gap-3">
          <li
            v-for="study in studies"
            :key="study"
            class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
          >
            {{ study }}
          </li>
        </ul>

        <!-- TODO: docentprofielen inladen zodra de bron bekend is (Laravel API of CMS). -->
        <p class="mt-8 text-sm text-slate-500">
          Benieuwd wie je les gaat geven? Je maakt kennis tijdens de gratis proefles.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container-page flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl">Zin om kennis te maken?</h2>
          <p class="mt-2 text-slate-600">De eerste les is gratis en vrijblijvend.</p>
        </div>
        <NuxtLink to="/aanmelden" class="btn-primary">Plan een proefles</NuxtLink>
      </div>
    </section>
  </div>
</template>
