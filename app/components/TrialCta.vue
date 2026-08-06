<script setup lang="ts">
import { contact, trialCta } from '~/data/site'

/**
 * The amber block that closes most pages: the pitch on the left, a short
 * callback form on the right.
 */
</script>

<template>
  <section class="bg-white px-[clamp(16px,4vw,24px)] pb-[clamp(56px,7vw,88px)]">
    <div
      class="mx-auto grid max-w-[1040px] items-start gap-[clamp(26px,3.5vw,44px)] rounded-card bg-brand-500 p-[clamp(26px,3.5vw,44px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
    >
      <div class="min-w-0">
        <p class="mb-2 text-[15px] font-semibold text-on-brand">{{ trialCta.kicker }}</p>
        <h2 class="mb-3.5 text-[clamp(23px,2.6vw,31px)] tracking-[-0.025em]">
          {{ trialCta.title }}
        </h2>
        <p class="mb-6 max-w-[44ch] text-[14.5px] leading-relaxed text-on-brand-muted">
          {{ trialCta.body }}
        </p>

        <CheckList :items="trialCta.promises" variant="tight" class="mb-7" />

        <div class="flex max-w-[360px] items-center gap-3.5 rounded-tile bg-sand p-3.5">
          <img
            src="/img/persoonlijk.png"
            alt=""
            class="h-[58px] w-[58px] flex-none rounded object-cover"
            width="58"
            height="58"
            loading="lazy"
          >
          <div class="min-w-0">
            <p class="text-[12.5px] text-ink-600">Sneller contact?</p>
            <p class="mt-0.5 mb-1 text-[17px] font-bold">{{ contact.whatsapp }}</p>
            <a
              :href="contact.whatsappHref"
              rel="noopener"
              class="inline-flex items-center gap-1.5 border-b-[1.5px] border-ink-900 text-[13px] font-semibold whitespace-nowrap"
            >
              <svg class="h-3.5 w-3.5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.6 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3.1-1.3-5.1-4.4-5.3-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.1c.1.2.1.4 0 .6l-.4.5-.3.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6 0l.9-1.1c.2-.2.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"
                />
              </svg>
              Bericht ons →
            </a>
          </div>
        </div>
      </div>

      <LeadForm class="min-w-0 rounded-tile bg-white p-[clamp(18px,2vw,24px)]" />
    </div>
  </section>
</template>
