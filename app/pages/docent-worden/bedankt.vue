<script setup lang="ts">
import { contact, docentWordenBedanktPage as page } from '~/data/site'

/**
 * Where `ApplicationForm` sends an applicant once the aanmelding has reached
 * us — the docent counterpart of `/aanmelden/bedankt/`, laid out the same way.
 *
 * A page rather than a state of the form so the conversion has a URL. The
 * event itself (`sollicitatie_verzonden`, and `form_submit` with
 * `form_name: sollicitatie`) goes out from the form on the API's answer, so
 * reloading this page never counts a second application.
 *
 * The kennismaking outcome comes across in shared state, read once and
 * cleared; on a reload there is none and the page says the general thing.
 */
useSeo({
  title: page.seoTitle,
  description: page.seoDescription,
})

// A confirmation, not a landing page — out of the index and out of the
// sitemap, and deliberately not in `STATIC_PATHS`.
useHead({ meta: [{ name: 'robots', content: 'noindex, follow' }] })

const handoff = useApplicationHandoff()
const intake = handoff.value?.intake ?? null
handoff.value = null
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

      <p v-if="intake?.booked" class="text-base leading-7 text-ink-700">
        {{ page.booked }}
        <strong class="font-semibold text-ink-800">{{ intake.label }}</strong>.
        <template v-if="intake.location">
          {{ page.bookedLocation }} {{ intake.location }}.
        </template>
      </p>
      <p v-else class="text-base leading-7 text-ink-700">
        {{ intake ? page.notBooked : page.body }}
      </p>

      <!--
        E-mail only. A WhatsApp or phone link would have to push
        `contact_click`, which Meta's Lead tag fires on — and a docent is not a
        lead, so that would count applicants as customers in the ads.
      -->
      <p class="mt-6 text-[15px] leading-7">
        {{ page.contactPrefix }}
        <a :href="contact.emailHref" class="font-semibold underline">{{ contact.email }}</a>.
      </p>

      <NuxtLink to="/" class="btn-primary btn-lg mt-3">
        {{ page.home }}
        <BtnArrow />
      </NuxtLink>
    </div>
  </section>
</template>
