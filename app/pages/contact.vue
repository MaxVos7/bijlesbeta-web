<script setup lang="ts">
import { contact, contactPage } from '~/data/site'

useSeoMeta({
  title: 'Contact',
  description:
    'Neem contact op met Bijles Bèta in Groningen via WhatsApp, telefoon of e-mail. We reageren doorgaans binnen één werkdag.',
})
</script>

<template>
  <div>
    <!--
      Hero and form share one band on the sand ground: the contact details sit
      left, the form panel right, and the auto-fit grid drops them into a single
      column once the columns can no longer hold 330px.
    -->
    <section
      class="bg-sand px-[clamp(16px,4vw,24px)] pt-[clamp(28px,4vw,52px)] pb-[clamp(48px,7vw,88px)]"
    >
      <div
        class="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(330px,1fr))]"
      >
        <div class="min-w-0">
          <p class="kicker mb-2.5">{{ contactPage.kicker }}</p>

          <h1
            class="mb-[18px] max-w-[18ch] text-[clamp(28px,3.6vw,40px)] leading-[1.15] text-pretty"
          >
            {{ contactPage.title }}
          </h1>

          <p class="mb-[30px] max-w-[52ch] text-[15px] leading-[1.7] text-ink-600">
            {{ contactPage.intro }}
          </p>

          <div class="mb-[clamp(28px,3.5vw,40px)] flex flex-col gap-[18px]">
            <a
              :href="contact.whatsappHref"
              rel="noopener"
              class="flex items-center gap-4 text-[15px] font-bold transition hover:text-brand-700"
            >
              <span
                class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-brand-500 text-white"
              >
                <svg class="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 1.8a8.2 8.2 0 016.9 12.6l-.2.3.7 2.6-2.7-.7-.3.2A8.2 8.2 0 1112 3.8zm-3.5 4c-.2 0-.5.1-.7.4-.3.3-.8.9-.8 1.9 0 1 .7 2 1 2.4.3.4 1.5 2.5 3.8 3.4 1.9.7 2.3.6 2.7.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3l-1.4-.7c-.2-.1-.4-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-1.8-1.1-.6-.6-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4l.4-.5c.1-.2.1-.3 0-.5l-.6-1.4c-.1-.3-.3-.3-.5-.3h-.6z"
                  />
                </svg>
              </span>
              {{ contact.phone }}
            </a>

            <a
              :href="contact.emailHref"
              class="flex items-center gap-4 text-[15px] font-bold transition hover:text-brand-700"
            >
              <span
                class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-brand-500 text-white"
              >
                <svg
                  class="h-[18px] w-[18px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3.5 6.5 8.5 6 8.5-6" />
                </svg>
              </span>
              {{ contact.email }}
            </a>
          </div>

          <div
            class="grid gap-x-8 gap-y-0 text-sm leading-[1.7] [grid-template-columns:repeat(auto-fit,minmax(190px,max-content))]"
          >
            <div>
              <p class="mb-0.5 font-bold">{{ contactPage.openingHoursTitle }}</p>
              <div
                class="grid justify-start gap-x-[22px] gap-y-0.5 text-ink-700 [grid-template-columns:auto_auto]"
              >
                <template v-for="row in contact.openingHoursRows" :key="row.days">
                  <span>{{ row.days }}</span><span>{{ row.hours }}</span>
                </template>
              </div>
            </div>

            <div class="border-l border-line-300 pl-8">
              <p class="mb-0.5 font-bold">Bijles Bèta</p>
              <p class="text-ink-700">
                {{ contact.address.street }},<br >
                {{ contact.address.postalCode }} {{ contact.address.city }}
              </p>
            </div>
          </div>
        </div>

        <div class="min-w-0">
          <ContactForm variant="panel" />
        </div>
      </div>
    </section>

    <!-- Heading beside the accordion rather than above it, unlike FaqSection. -->
    <section id="faq" class="bg-white px-[clamp(16px,4vw,24px)] py-[clamp(56px,7vw,96px)]">
      <div
        class="mx-auto grid max-w-[1180px] items-start gap-[clamp(24px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
      >
        <div class="min-w-0">
          <h2 class="mb-3.5 text-[clamp(24px,2.9vw,33px)] tracking-[-0.025em] text-pretty">
            {{ contactPage.faq.title }}
          </h2>
          <p class="text-[14.5px] leading-[1.7] text-ink-700">{{ contactPage.faq.body }}</p>
        </div>

        <div class="min-w-0">
          <FaqList size="lg" />
        </div>
      </div>
    </section>

    <StatsBand />
  </div>
</template>
