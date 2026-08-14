<script setup lang="ts">
import { contact, featuredReview } from '~/data/site'

useSeoMeta({
  title: 'Aanmelden voor een gratis proefles',
  description:
    'Meld je aan voor een gratis en vrijblijvende proefles. Na je aanmelding neemt een van onze docenten contact met je op om de proefles in te plannen.',
})

const review = featuredReview
</script>

<template>
  <div>
    <section
      class="bg-cream px-[clamp(16px,4vw,24px)] pt-[clamp(28px,4vw,48px)] pb-[clamp(48px,6vw,80px)]"
    >
      <div
        class="mx-auto grid max-w-[1100px] items-start gap-[clamp(28px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      >
        <div class="min-w-0">
          <p class="kicker mb-2.5">Aanmelden</p>
          <h1 class="mb-[26px] text-[clamp(24px,2.9vw,32px)] tracking-[-0.03em]">
            Zo kan je ons bereiken
          </h1>

          <div class="mb-[34px] flex flex-col gap-3.5">
            <a
              :href="contact.whatsappHref"
              rel="noopener"
              class="flex items-center gap-3.5 text-[14.5px] font-semibold"
            >
              <span
                class="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg bg-brand-100"
              >
                <svg
                  class="h-[15px] w-[15px] text-brand-700"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.6 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3.1-1.3-5.1-4.4-5.3-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.1c.1.2.1.4 0 .6l-.4.5-.3.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6 0l.9-1.1c.2-.2.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"
                  />
                </svg>
              </span>
              {{ contact.phone }}
            </a>

            <a :href="contact.emailHref" class="flex items-center gap-3.5 text-[14.5px] font-semibold">
              <span
                class="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg bg-brand-100"
              >
                <svg
                  class="h-[15px] w-[15px] text-brand-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <rect x="2.5" y="5" width="19" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </span>
              {{ contact.email }}
            </a>
          </div>

          <template v-if="review">
            <h2 class="mb-4 text-base">Wat mensen over ons zeggen</h2>

            <figure class="max-w-[330px] rounded-panel border border-line-200 bg-white p-[22px]">
              <svg class="mb-2.5 block h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
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

              <p class="mb-2 text-[13px] tracking-[1px] text-accent-500">
                <span class="sr-only">{{ review.rating }} van de 5 sterren</span>
                <span aria-hidden="true">{{ '★'.repeat(review.rating) }}</span>
              </p>

              <h3 class="mb-1.5 text-sm">{{ review.title }}</h3>
              <blockquote class="mb-5 text-[13px] leading-[1.65] text-ink-700">
                {{ review.body }}
              </blockquote>

              <figcaption>
                <span class="block text-[13.5px] font-bold">{{ review.author }}</span>
                <span class="block text-xs text-ink-400">{{ review.affiliation }}</span>
              </figcaption>
            </figure>
          </template>
        </div>

        <div id="form" class="min-w-0">
          <SignupForm />
        </div>
      </div>
    </section>

    <section class="bg-white px-[clamp(16px,4vw,24px)] py-[clamp(48px,6vw,80px)]">
      <div
        class="mx-auto grid max-w-[1100px] items-start gap-[clamp(26px,4vw,50px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
      >
        <div>
          <h2 class="mb-3 text-[clamp(22px,2.5vw,28px)] tracking-[-0.025em]">
            Veelgestelde vragen (FAQ)
          </h2>
          <p class="text-sm text-ink-600">Bekijk onze veelgestelde vragen (FAQ)</p>
        </div>

        <FaqList />
      </div>
    </section>

    <StatsBand />
  </div>
</template>
