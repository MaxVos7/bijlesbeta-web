<script setup lang="ts">
import { contact, contactPage } from '~/data/site'

useSeo({
  title: 'Contact',
  description:
    'Hoi! Mijn naam is Max en ik ben de contactpersoon van Bijles Bèta. Twijfel je ergens over? Of heb je een vraag. Neem dan nu contact op.',
})
</script>

<template>
  <div>
    <!--
      Measured against `post-46.css`, not designed. The page is three bands on
      the live site and the numbers below are that page's own:

      - the hero row carries `--content-width:1100px`, a 63px gap and a 50/50
        split above 768px, and sits on the page's own parchment rather than on
        a ground of its own;
      - a 43px spacer closes the parchment, then 84px of white opens the FAQ;
      - the FAQ splits 40/60 on a zero gutter, with the accordion inset 24px.

      The column gap inside the hero's left column is 12px, which is the
      Elementor container default there — the widget margins (4px under the H1,
      12px above and below the icon list) stack on top of it.
    -->
    <section class="px-[clamp(16px,4vw,40px)] pt-9 pb-[43px]">
      <div class="mx-auto grid max-w-[1100px] items-center gap-[63px] md:grid-cols-2">
        <div class="flex min-w-0 flex-col justify-center gap-3 py-9">
          <!-- 19px, not the sitewide 18px `kicker` — this page runs its own. -->
          <p class="kicker text-[19px] leading-[19px]">{{ contactPage.kicker }}</p>

          <h1 class="mb-1 text-[32px] leading-[44px]">{{ contactPage.title }}</h1>

          <p class="text-[14px] leading-[21px] text-ink-700">{{ contactPage.intro }}</p>

          <!--
            The live icon list draws Font Awesome's `whatsapp` and `envelope`
            glyphs at 32px in the flat brand amber — no disc behind them — with
            12px to the label and 16px between the rows.
          -->
          <ul class="my-3 flex flex-col gap-4">
            <li>
              <a
                :href="contact.whatsappHref"
                rel="noopener"
                class="flex items-center gap-3 font-display text-[17px] leading-[1.5] font-semibold transition hover:text-brand-700"
              >
                <span class="flex w-10 flex-none justify-center text-accent-500">
                  <svg
                    class="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 1.8a8.2 8.2 0 016.9 12.6l-.2.3.7 2.6-2.7-.7-.3.2A8.2 8.2 0 1112 3.8zm-3.5 4c-.2 0-.5.1-.7.4-.3.3-.8.9-.8 1.9 0 1 .7 2 1 2.4.3.4 1.5 2.5 3.8 3.4 1.9.7 2.3.6 2.7.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3l-1.4-.7c-.2-.1-.4-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-1.8-1.1-.6-.6-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4l.4-.5c.1-.2.1-.3 0-.5l-.6-1.4c-.1-.3-.3-.3-.5-.3h-.6z"
                    />
                  </svg>
                </span>
                {{ contact.phone }}
              </a>
            </li>

            <li>
              <a
                :href="contact.emailHref"
                class="flex items-center gap-3 font-display text-[17px] leading-[1.5] font-semibold transition hover:text-brand-700"
              >
                <span class="flex w-10 flex-none justify-center text-accent-500">
                  <svg
                    class="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6.8A2.8 2.8 0 0 1 4.8 4h14.4A2.8 2.8 0 0 1 22 6.8v.3l-9.5 5.6a1 1 0 0 1-1 0L2 7.1v-.3Z"
                    />
                    <path
                      d="M22 9.4v7.8a2.8 2.8 0 0 1-2.8 2.8H4.8A2.8 2.8 0 0 1 2 17.2V9.4l9 5.3c.6.4 1.4.4 2 0l9-5.3Z"
                    />
                  </svg>
                </span>
                {{ contact.email }}
              </a>
            </li>
          </ul>

          <!--
            Two equal columns on a 12px gutter, the rule drawn on the right edge
            of the first rather than the left edge of the second — that is where
            the live widget hangs its border. The live markup pads the hours
            apart with `&nbsp;`; a two-column grid gets the same result honestly.
          -->
          <!-- Elementor wraps these two onto separate lines below 768px and
               leaves the rule hanging; ours drops it instead. -->
          <div class="flex flex-col gap-4 text-[16px] leading-[24px] md:flex-row md:gap-3">
            <div class="flex-1 md:border-r md:border-black/10">
              <p class="font-bold">{{ contactPage.openingHoursTitle }}</p>
              <div class="grid justify-start gap-x-[18px] [grid-template-columns:auto_auto]">
                <template v-for="row in contact.openingHoursRows" :key="row.days">
                  <span>{{ row.days }}</span><span>{{ row.hours }}</span>
                </template>
              </div>
            </div>

            <div class="flex-1">
              <p class="font-bold">Bijles Bèta</p>
              <p>
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

    <!--
      Heading beside the accordion rather than above it, unlike `FaqSection`.
      The band opens on 84px of white and closes on `StatsBand`'s own 80px, so
      it carries no bottom padding of its own.
    -->
    <section id="faq" class="bg-white px-[clamp(16px,4vw,40px)] pt-[84px]">
      <div class="mx-auto grid max-w-[1100px] items-start md:grid-cols-[40%_60%]">
        <div class="min-w-0">
          <h2 class="mb-1 text-[27px] leading-[44px]">{{ contactPage.faq.title }}</h2>
          <p class="text-[16px] leading-[24px]">{{ contactPage.faq.body }}</p>
        </div>

        <!-- The live accordion sits 24px inside its 60% column. -->
        <div class="mt-8 min-w-0 md:mt-0 md:pl-6">
          <FaqList size="lg" />
        </div>
      </div>
    </section>

    <StatsBand />
  </div>
</template>
