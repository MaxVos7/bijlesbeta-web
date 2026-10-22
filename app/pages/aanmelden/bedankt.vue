<script setup lang="ts">
import { aanmeldenBedanktPage as page, contact, zoWerktHet } from '~/data/site'

/**
 * Where `SignupForm` sends a visitor once the aanmelding has reached us.
 *
 * It is a page rather than a state of the form so the conversion has a URL:
 * PostHog records it as a `$pageview` on `/aanmelden/bedankt/`, and a funnel
 * or an ad platform can point at it. The conversion *event* is not fired
 * here, though — `aanmelding_voltooid` goes out from the form on the API's
 * answer, so reloading this page never counts a second lead.
 *
 * On the default layout, unlike `/aanmelden`: the wizard has no chrome to keep
 * a visitor from wandering off mid-form, and once they are done that reason
 * is gone and a dead end would be worse.
 */
useSeo({
  title: page.seoTitle,
  description: page.seoDescription,
})

// A confirmation, not a landing page — out of the index and out of the
// sitemap, and deliberately not in `STATIC_PATHS`.
useHead({ meta: [{ name: 'robots', content: 'noindex, follow' }] })

// Stap 1 is the aanmelding the visitor just finished.
const nextSteps = zoWerktHet.steps.slice(1)
</script>

<template>
  <section class="px-[clamp(16px,4vw,40px)] py-20">
    <div class="mx-auto flex max-w-[728px] flex-col items-center gap-3 rounded-block bg-white p-6 text-center shadow-panel md:p-10">
      <span
        class="mb-3 inline-flex h-[54px] w-[54px] items-center justify-center rounded-full bg-success-50"
      >
        <svg
          class="h-[26px] w-[26px] text-success-900"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12l6 6L20 6" />
        </svg>
      </span>

      <p class="font-display text-[19px] leading-[19px] font-bold text-accent-500">
        {{ page.kicker }}
      </p>
      <h1 class="text-[clamp(26px,2.9vw,32px)] leading-[44px] tracking-normal">
        {{ page.title }}
      </h1>
      <p class="text-base leading-7 text-ink-700">{{ page.body }}</p>

      <h2 class="mt-6 text-[22px] leading-[44px] tracking-normal">{{ page.nextTitle }}</h2>
      <ol class="grid w-full gap-3 text-left">
        <li
          v-for="nextStep in nextSteps"
          :key="nextStep.title"
          class="rounded-panel border border-line-ink p-4"
        >
          <p class="font-display text-[16px] leading-[26px] font-bold">{{ nextStep.title }}</p>
          <p class="text-[15px] leading-7">{{ nextStep.body }}</p>
        </li>
      </ol>

      <p class="mt-6 text-[15px] leading-7">
        {{ page.contactPrefix }}
        <a :href="contact.whatsappHref" rel="noopener" target="_blank" class="font-semibold underline">{{ contact.phone }}</a>
        {{ page.contactOr }}
        <a :href="contact.emailHref" class="font-semibold underline">{{ contact.email }}</a>.
      </p>

      <NuxtLink to="/" class="btn-primary btn-lg mt-3">
        {{ page.home }}
        <BtnArrow />
      </NuxtLink>
    </div>
  </section>
</template>
