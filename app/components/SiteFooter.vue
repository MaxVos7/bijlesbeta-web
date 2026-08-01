<script setup lang="ts">
import { contact, nav, subjects } from '~/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-200 bg-slate-50">
    <div class="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <p class="text-lg font-bold text-brand-700">Bijles Bèta</p>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">
          Persoonlijke bijles in wiskunde, natuurkunde en scheikunde, gegeven door
          bètastudenten van de Rijksuniversiteit Groningen.
        </p>
      </div>

      <div>
        <h2 class="text-sm font-semibold text-slate-900">Menu</h2>
        <ul class="mt-4 space-y-2">
          <li v-for="item in nav" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="text-sm text-slate-600 transition hover:text-brand-700"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-sm font-semibold text-slate-900">Vakken</h2>
        <ul class="mt-4 space-y-2">
          <li v-for="subject in subjects" :key="subject.slug">
            <span class="text-sm text-slate-600">{{ subject.name }}</span>
          </li>
          <li><span class="text-sm text-slate-600">Bijles aan huis</span></li>
        </ul>
      </div>

      <div>
        <h2 class="text-sm font-semibold text-slate-900">Contact</h2>
        <ul class="mt-4 space-y-2 text-sm text-slate-600">
          <li>
            <a :href="contact.phoneHref" class="transition hover:text-brand-700">
              {{ contact.phone }}
            </a>
          </li>
          <li>
            <a
              :href="contact.whatsappHref"
              class="transition hover:text-brand-700"
              rel="noopener"
            >
              WhatsApp {{ contact.whatsapp }}
            </a>
          </li>
          <li>
            <a :href="contact.emailHref" class="transition hover:text-brand-700">
              {{ contact.email }}
            </a>
          </li>
          <li class="pt-2">
            {{ contact.address.street }}<br >
            {{ contact.address.postalCode }} {{ contact.address.city }}
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-slate-200">
      <div
        class="container-page flex flex-col gap-2 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>&copy; {{ year }} Bijles Bèta. Alle rechten voorbehouden.</p>
        <p>{{ contact.openingHours }}</p>
      </div>
    </div>
  </footer>
</template>
