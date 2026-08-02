<script setup lang="ts">
import { faqIntro } from '~/data/site'
</script>

<template>
  <section id="faq" class="bg-sand px-[clamp(16px,4vw,24px)] py-[clamp(56px,7vw,88px)]">
    <div class="mx-auto max-w-[1180px]">
      <div class="mb-[clamp(24px,3.2vw,36px)] text-center">
        <h2 class="mb-3 text-[clamp(24px,2.9vw,33px)] tracking-[-0.025em]">{{ faqIntro.title }}</h2>
        <p class="text-[14.5px] text-ink-700">
          {{ faqIntro.before }}
          <NuxtLink to="/contact" class="border-b-[1.5px] border-ink-900">{{ faqIntro.link }}</NuxtLink>
        </p>
      </div>

      <div class="mx-auto max-w-[840px] rounded-card bg-white px-[clamp(18px,2.6vw,30px)] py-2.5">
        <FaqList size="lg" />
      </div>
    </div>
  </section>
</template>
