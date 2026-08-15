<script setup lang="ts">
import { aanmeldenPage, contact, featuredReview } from '~/data/site'

/**
 * The live page runs without the site chrome — bijlesbeta.nl serves
 * `/aanmelden` as the Elementor page and nothing else, so the wizard has no
 * header or footer to click away to. See `layouts/bare.vue`.
 */
definePageMeta({ layout: 'bare' })

useSeoMeta({
  title: 'Aanmelden voor een gratis proefles',
  description:
    'Meld je aan voor een gratis en vrijblijvende proefles. Na je aanmelding neemt een van onze docenten contact met je op om de proefles in te plannen.',
})

const review = featuredReview
</script>

<template>
  <div>
    <!--
      The opening band sits on the page's own ground (`parchment`, set on
      <body>) rather than repainting it, and splits 34.237% / the rest on a
      63px gutter inside the 1100px column — the live container's own numbers.
      Below 768px the columns stack *and swap*: the live form column carries
      `--order: -99999`, so on a phone the wizard comes first and the contact
      details and review follow it.
    -->
    <section class="px-[clamp(16px,4vw,40px)] pt-9">
      <div
        class="mx-auto flex max-w-[1100px] flex-col-reverse items-start gap-[63px] md:flex-row"
      >
        <div class="flex w-full min-w-0 flex-col gap-3 pt-9 md:w-[34.237%] md:flex-none">
          <p class="font-display text-[19px] leading-[19px] font-bold text-accent-500">
            {{ aanmeldenPage.kicker }}
          </p>

          <!--
            32px on a 44px line, stepping to 26px below 768px, and with no
            negative tracking: the live heading widget sets `letter-spacing:
            normal`, so this one opts out of the base `tracking-tight`.
          -->
          <h1 class="text-[clamp(26px,2.9vw,32px)] leading-[44px] tracking-normal">
            {{ aanmeldenPage.title }}
          </h1>

          <ul class="flex flex-col gap-2">
            <li v-for="row in [
              {
                href: contact.phoneWhatsappHref,
                label: contact.phone,
                external: true,
                icon: 'whatsapp',
              },
              { href: contact.emailHref, label: contact.email, external: false, icon: 'mail' },
            ]" :key="row.label">
              <a
                :href="row.href"
                :rel="row.external ? 'noopener' : undefined"
                :target="row.external ? '_blank' : undefined"
                class="flex items-center"
              >
                <span
                  class="mr-2 flex h-8 w-8 flex-none items-center justify-center rounded-field bg-accent-500/15 text-accent-500"
                >
                  <svg
                    v-if="row.icon === 'whatsapp'"
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.6 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3.1-1.3-5.1-4.4-5.3-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.1c.1.2.1.4 0 .6l-.4.5-.3.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6 0l.9-1.1c.2-.2.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 17.5v-11zm2.3-.5L12 12.2 19.7 6H4.3z"
                    />
                  </svg>
                </span>
                <span class="pl-[5px] text-[17px] leading-[25.5px] font-semibold text-ink-900">
                  {{ row.label }}
                </span>
              </a>
            </li>
          </ul>

          <template v-if="review">
            <h2 class="mb-2.5 text-[18px] leading-[44px] font-semibold text-ink-900">
              {{ aanmeldenPage.reviewsTitle }}
            </h2>

            <figure
              class="flex flex-col gap-5 rounded-panel border border-line-ink bg-white p-6"
            >
              <div class="flex flex-col gap-3">
                <svg class="block h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    fill="#FFC107"
                    d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36a12 12 0 110-24c3.1 0 5.8 1.2 8 3.1l5.7-5.7A20 20 0 1044 24c0-1.3-.1-2.6-.4-3.9z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8A12 12 0 0124 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7A20 20 0 006.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0124 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5A20 20 0 0024 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.1H42V20H24v8h11.3a12 12 0 01-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
                  />
                </svg>

                <p class="text-[16px] leading-4 tracking-[1px] text-accent-500">
                  <span class="sr-only">{{ review.rating }} van de 5 sterren</span>
                  <span aria-hidden="true">{{ '★'.repeat(review.rating) }}</span>
                </p>

                <blockquote class="text-base leading-6 whitespace-pre-line text-ink-900">
                  <strong class="font-bold">{{ review.title }}</strong><br>{{ review.body }}
                </blockquote>
              </div>

              <figcaption>
                <p class="text-[15px] leading-[26px] font-bold text-ink-900">
                  {{ review.author }}
                </p>
                <p class="text-[13px] leading-[13px] text-ink-700">{{ review.affiliation }}</p>
              </figcaption>
            </figure>
          </template>
        </div>

        <div id="form" class="w-full min-w-0 md:flex-1">
          <SignupForm />
        </div>
      </div>
    </section>

    <!-- The 43px strip of page ground between the wizard and the white half. -->
    <div class="h-[43px]" />

    <!--
      The live page separates its bands with spacer strips rather than section
      padding; `StatsBand` brings its own 80px, so only the strip above the FAQ
      is written out here.
    -->
    <div class="bg-white pt-[84px]">
      <section class="px-[clamp(16px,4vw,40px)]">
        <div class="mx-auto flex max-w-[1100px] flex-col items-start gap-10 md:flex-row md:gap-0">
          <div class="flex w-full min-w-0 flex-col gap-3 md:w-2/5 md:flex-none">
            <h2 class="text-[clamp(24px,2.9vw,27px)] leading-[44px] tracking-normal">
              {{ aanmeldenPage.faq.title }}
            </h2>
            <p class="text-base leading-6 text-ink-900">{{ aanmeldenPage.faq.body }}</p>
          </div>

          <div class="w-full min-w-0 md:w-3/5">
            <FaqList size="lg" />
          </div>
        </div>
      </section>

      <StatsBand />
    </div>
  </div>
</template>
