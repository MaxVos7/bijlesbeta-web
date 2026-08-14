<script setup lang="ts">
import { contact, trialCta } from '~/data/site'

/**
 * The amber block that closes most pages: the pitch on the left, a short
 * callback form on the right.
 *
 * Measured off bijlesbeta.nl: a 1100px panel on the 12px block radius with
 * 36px of padding, 48px of white above and below it, and its kicker in plain
 * white rather than the `on-brand` amber-ink the handoff used.
 */
</script>

<template>
  <section class="bg-white px-[clamp(16px,4vw,40px)] py-12">
    <div
      class="mx-auto grid max-w-[1100px] items-start gap-3 rounded-block bg-brand-500 p-[clamp(20px,3vw,36px)] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]"
    >
      <div class="min-w-0">
        <p class="kicker mb-1 text-white">{{ trialCta.kicker }}</p>
        <h2 class="mb-3.5 text-[28px] leading-[44px] tracking-[-0.025em]">
          {{ trialCta.title }}
        </h2>
        <p class="mb-6 max-w-[44ch] text-[15px] leading-[22.5px] text-ink-700">
          {{ trialCta.body }}
        </p>

        <CheckList :items="trialCta.promises" class="mb-7" />

        <!-- Translucent white rather than a solid neutral: the amber has to
             read through it, as it does on the live block. -->
        <div class="flex max-w-[360px] items-center gap-3 rounded-tile bg-white/30 px-3 py-[13.5px]">
          <img
            src="/img/persoonlijk.png"
            alt=""
            class="h-[78px] w-[78px] flex-none rounded object-cover"
            width="78"
            height="78"
            loading="lazy"
          >
          <div class="min-w-0">
            <p class="text-[13px] leading-[19.5px] font-semibold text-ink-800">Sneller contact?</p>
            <p class="text-[19px] leading-[28.5px] font-semibold text-ink-800">
              {{ contact.whatsapp }}
            </p>
            <a
              :href="contact.whatsappHref"
              rel="noopener"
              class="inline-flex items-center gap-1.5 border-b-[1.5px] border-ink-900 text-[15px] leading-[15px] font-bold whitespace-nowrap text-ink-800"
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

      <LeadForm class="min-w-0 rounded-tile bg-linen px-6 py-3.5" />
    </div>
  </section>
</template>
