<script setup lang="ts">
import { contact, faqIntro, faqs } from '~/data/site'

const props = withDefaults(
  defineProps<{
    /** Overrides the sitewide questions, e.g. the campaign's own on `/openingsactie-utrecht`. */
    items?: readonly { question: string; lead?: string; answer: string }[]
    /**
     * Where "Neem contact op!" goes. `whatsapp` is for pages without the site
     * chrome, where sending a visitor to `/contact` would lead them off the page.
     */
    contactLink?: 'page' | 'whatsapp'
  }>(),
  { items: undefined, contactLink: 'page' },
)

/*
  The FAQ rich result comes from here rather than from each page, so the
  markup can only ever describe questions that are actually rendered — Google
  treats FAQ markup for invisible content as a violation, not a hint.
*/
useFaqJsonLd(props.items ?? faqs)
</script>

<template>
  <!-- The accordion closes the page on the site's own parchment rather than a
       ground of its own — `sand` reads a shade cooler and shows as a seam. -->
  <section id="faq" class="px-[clamp(16px,4vw,40px)] pt-12 pb-20">
    <!-- The whole block — heading, intro and accordion — runs 728px on the
         live site (`b8fc3e6` in post-185), not the page's 1100px column. -->
    <div class="mx-auto max-w-[728px]">
      <div class="mb-[clamp(24px,3.2vw,36px)] text-center">
        <h2 class="mb-3 text-[32px] leading-[44px] tracking-[-0.025em] text-ink-850">
          {{ faqIntro.title }}
        </h2>
        <p class="text-base leading-6 text-ink-800">
          {{ faqIntro.before }}
          <a
            v-if="contactLink === 'whatsapp'"
            :href="contact.whatsappHref"
            rel="noopener"
            class="border-b-[1.5px] border-ink-900"
          >{{ faqIntro.link }}</a>
          <NuxtLink v-else to="/contact" class="border-b-[1.5px] border-ink-900">{{ faqIntro.link }}</NuxtLink>
        </p>
      </div>

      <div class="rounded-card bg-white p-6">
        <FaqList size="lg" :items="items" />
      </div>
    </div>
  </section>
</template>
