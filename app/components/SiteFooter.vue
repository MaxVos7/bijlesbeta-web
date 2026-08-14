<script setup lang="ts">
import { landingPath } from '~/data/landings'
import {
  contact,
  legalLinks,
  nav,
  portalLinks,
  socials,
  subjects,
  tagline,
} from '~/data/site'

const config = useRuntimeConfig()

// The live site's footer omits Kennisbank — it's a header-only link there.
const footerNav = nav.filter((item) => item.label !== 'Kennisbank')
</script>

<template>
  <!-- Bordered so it still reads as its own band when the page ends on the
       sand-coloured FAQ section. -->
  <footer
    class="border-t border-line-200 bg-sand px-[clamp(16px,4vw,24px)] pt-[clamp(48px,6vw,72px)] pb-[clamp(44px,5vw,64px)]"
  >
    <div class="mx-auto max-w-[1100px]">
      <div
        class="mb-[clamp(38px,5vw,58px)] flex flex-col items-center gap-4 text-center"
      >
        <NuxtLink to="/" aria-label="Bijles Bèta — naar de homepage">
          <img
            src="/logo.svg"
            alt="Bijles Bèta"
            class="block h-[clamp(42px,4vw,54px)] w-auto"
            width="142"
            height="56"
          >
        </NuxtLink>

        <p class="text-[clamp(17px,1.7vw,20px)] font-bold tracking-tight">{{ tagline }}</p>

        <ul class="mt-0.5 flex gap-4">
          <li v-for="social in socials" :key="social.label">
            <a
              :href="social.href"
              rel="noopener"
              target="_blank"
              class="block transition hover:text-brand-700"
              :aria-label="social.label"
            >
              <svg
                v-if="social.label === 'Facebook'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z"
                />
              </svg>
              <svg
                v-else-if="social.label === 'Instagram'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
              </svg>
              <svg
                v-else-if="social.label === 'LinkedIn'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M20.4 3H3.6A.6.6 0 003 3.6v16.8c0 .3.3.6.6.6h16.8c.3 0 .6-.3.6-.6V3.6a.6.6 0 00-.6-.6zM8.3 18.3H5.6V9.7h2.7v8.6zM6.9 8.6a1.6 1.6 0 110-3.2 1.6 1.6 0 010 3.2zm11.4 9.7h-2.7V14c0-1-.3-1.7-1.2-1.7-.7 0-1.1.5-1.3 1a1.6 1.6 0 00-.1.6v4.4h-2.7V9.7H13v1.2c.4-.6 1-1.4 2.6-1.4 1.9 0 3.3 1.2 3.3 3.9v4.9z"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.9-6.3L5.1 21H2l7.3-8.3L2.4 3h6.3l4.4 5.8L17.5 3z" />
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <div
        class="grid gap-[clamp(24px,3vw,36px)] text-[13.5px] leading-[1.7] [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]"
      >
        <div>
          <p class="font-bold">Bijles Bèta</p>
          <p class="text-ink-700">
            {{ contact.address.street }}, {{ contact.address.postalCode }}
            {{ contact.address.city }}
          </p>

          <p class="mt-4 font-bold">Te bereiken op:</p>
          <div class="mt-1 grid justify-start gap-x-[22px] gap-y-0.5 text-ink-700 [grid-template-columns:auto_auto]">
            <template v-for="row in contact.openingHoursRows" :key="row.days">
              <span>{{ row.days }}</span><span>{{ row.hours }}</span>
            </template>
          </div>
        </div>

        <div>
          <p class="mb-2.5 font-bold text-brand-700">Contact</p>
          <p class="text-xs text-ink-500">Whatsapp of bel ons!</p>
          <a :href="contact.phoneHref" class="text-[15px] font-bold">{{ contact.phone }}</a>
          <p class="mt-3 text-xs text-ink-500">Liever mailen?</p>
          <a :href="contact.emailHref" class="text-[15px] font-bold break-words">
            {{ contact.email }}
          </a>
        </div>

        <div>
          <p class="mb-2.5 font-bold text-brand-700">Vakken</p>
          <div class="flex flex-col items-start gap-1.5">
            <NuxtLink
              v-for="subject in subjects"
              :key="subject.slug"
              :to="landingPath(subject.slug)"
            >
              {{ subject.name }}
            </NuxtLink>
            <NuxtLink to="/tarieven">Bijles aan Huis</NuxtLink>
          </div>
        </div>

        <div>
          <p class="mb-2.5 font-bold text-brand-700">Mijn Bijles Bèta</p>
          <div class="mb-[18px] flex flex-col items-start gap-1.5">
            <a v-for="link in portalLinks" :key="link.label" :href="`${config.public.portalUrl}${link.path}`">
              {{ link.label }}
            </a>
          </div>
          <div class="flex flex-col items-start gap-2.5">
            <NuxtLink to="/aanmelden" class="btn-primary text-[13.5px]">Aanmelden →</NuxtLink>
            <a :href="config.public.portalUrl" class="btn-secondary text-[13.5px]">Inloggen →</a>
          </div>
        </div>

        <div>
          <p class="mb-2.5 font-bold text-brand-700">Navigatie</p>
          <div class="flex flex-col items-start gap-1.5">
            <NuxtLink v-for="item in footerNav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
            <NuxtLink v-for="item in legalLinks" :key="item.to" :to="item.to">
              {{ item.label }}
            </NuxtLink>
            <!-- TODO: reopens the cookie consent banner, which isn't built
                 yet — the anchor is a placeholder until it is. -->
            <a href="#cookies">Beheer cookies</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
