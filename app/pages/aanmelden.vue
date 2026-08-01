<script setup lang="ts">
import { contact } from '~/data/site'

useSeoMeta({
  title: 'Aanmelden voor een gratis proefles',
  description:
    'Meld je aan voor een gratis en vrijblijvende proefles. Meestal koppelen we binnen vijf dagen een passende docent aan je.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Aanmelden"
      title="Plan je gratis proefles"
      intro="Vertel ons kort wat je nodig hebt. Wij zoeken de docent erbij — meestal binnen vijf dagen."
    />

    <section class="section">
      <div class="container-page grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <SignupForm />

        <aside class="space-y-8">
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 class="text-lg">Wat gebeurt er hierna?</h2>
            <ol class="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
              <li>1. We bekijken je aanmelding en zoeken een passende docent.</li>
              <li>2. Je hoort van ons zodra we een match hebben, meestal binnen vijf dagen.</li>
              <li>3. Jullie plannen samen de gratis proefles in.</li>
              <li>4. Klikt het? Dan gaan jullie door. Zo niet, dan zoeken we verder.</li>
            </ol>
          </div>

          <div class="rounded-xl border border-slate-200 p-6">
            <h2 class="text-lg">Liever even bellen?</h2>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">
              Dat kan ook. We zijn bereikbaar op {{ contact.openingHours.toLowerCase() }}.
            </p>
            <div class="mt-4 space-y-2 text-sm">
              <p>
                <a :href="contact.phoneHref" class="font-medium text-brand-700 hover:underline">
                  {{ contact.phone }}
                </a>
              </p>
              <p>
                <a
                  :href="contact.whatsappHref"
                  rel="noopener"
                  class="font-medium text-brand-700 hover:underline"
                >
                  WhatsApp {{ contact.whatsapp }}
                </a>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>
