<script setup lang="ts">
import { contact } from '~/data/site'

useSeoMeta({
  title: 'Contact',
  description:
    'Neem contact op met Bijles Bèta in Groningen via telefoon, WhatsApp of e-mail. We reageren doorgaans binnen één werkdag.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Contact"
      title="Even overleggen?"
      intro="Bel, app of mail ons. We denken graag mee over wat je nodig hebt, ook als je nog niet zeker weet of bijles de juiste stap is."
    />

    <section class="section">
      <div class="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 class="text-2xl">Direct contact</h2>

          <dl class="mt-6 space-y-6">
            <div>
              <dt class="text-sm font-medium text-slate-500">Telefoon</dt>
              <dd class="mt-1">
                <a
                  :href="contact.phoneHref"
                  class="text-lg font-medium text-brand-700 hover:underline"
                >
                  {{ contact.phone }}
                </a>
              </dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-slate-500">WhatsApp</dt>
              <dd class="mt-1">
                <a
                  :href="contact.whatsappHref"
                  rel="noopener"
                  class="text-lg font-medium text-brand-700 hover:underline"
                >
                  {{ contact.whatsapp }}
                </a>
              </dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-slate-500">E-mail</dt>
              <dd class="mt-1">
                <a
                  :href="contact.emailHref"
                  class="text-lg font-medium text-brand-700 hover:underline"
                >
                  {{ contact.email }}
                </a>
              </dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-slate-500">Adres</dt>
              <dd class="mt-1 leading-relaxed text-slate-700">
                {{ contact.address.street }}<br >
                {{ contact.address.postalCode }} {{ contact.address.city }}
              </dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-slate-500">Openingstijden</dt>
              <dd class="mt-1 text-slate-700">{{ contact.openingHours }}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 class="text-2xl">Stuur een bericht</h2>
          <p class="mt-2 text-slate-600">We reageren doorgaans binnen één werkdag.</p>
          <ContactForm class="mt-8" />
        </div>
      </div>
    </section>

    <section class="section bg-slate-50">
      <div class="container-page max-w-3xl">
        <h2 class="text-2xl sm:text-3xl">Veelgestelde vragen</h2>
        <FaqList class="mt-8" />
      </div>
    </section>
  </div>
</template>
