<script setup lang="ts">
import { contact, excelTraining } from '~/data/site'

/**
 * The Excel training page, ported from bijlesbeta.nl's own
 * `/excel-training-groningen/`.
 *
 * It was the only live service page with no equivalent here, so the URL would
 * have 404'd at cutover and lost whatever it ranks for. It sells to businesses
 * rather than to pupils, so it borrows the site's chrome and type scale but
 * none of the bijles-specific components: no packages, no proefles CTA, and
 * its FAQ is its own five questions rather than the sitewide set.
 *
 * Copy is the live page's, verbatim including its own typos ("Je betaald ons
 * per uur") — the same call made for /werken-bij's Dutch is *not* made here,
 * because these are answers customers have already read.
 */
useSeo({
  absoluteTitle: true,
  title: 'Excel Training Groningen | 1-op-1 op Maat | Bijles Bèta',
  description:
    'Persoonlijke Excel training voor MKB in Groningen. Leer draaitabellen, formules en automatisering. Bij u op kantoor of online. Gratis intake. €60/uur.',
})

useFaqJsonLd(excelTraining.faq.items)
</script>

<template>
  <div>
    <section id="top" class="px-[clamp(16px,4vw,40px)] pt-9 pb-[43px]">
      <div class="mx-auto grid max-w-[1100px] items-center gap-[63px] md:grid-cols-2">
        <div class="flex min-w-0 flex-col justify-center gap-3 py-9">
          <RatingLine :label="excelTraining.hero.ratingLabel" />

          <h1 class="mb-1 text-[26px] leading-[44px] md:text-[32px]">
            {{ excelTraining.hero.title }}
          </h1>

          <p class="text-[16px] leading-[28px] text-ink-700">{{ excelTraining.hero.intro }}</p>

          <a href="#intake" class="btn-primary btn-lg mt-3 self-start">
            {{ excelTraining.hero.cta }} <BtnArrow />
          </a>
        </div>

        <div class="min-w-0">
          <img
            src="/img/uitleg-b.png"
            alt="Excel training bij jou op kantoor"
            class="block h-[350px] w-full rounded-panel object-cover object-center md:h-[450px]"
            loading="lazy"
          >
        </div>
      </div>
    </section>

    <section class="bg-white px-[clamp(16px,4vw,40px)] py-20">
      <div class="mx-auto max-w-[1400px]">
        <div class="mx-auto max-w-[62ch] text-center">
          <h2 class="text-[28px] leading-[44px] tracking-[-0.025em]">
            {{ excelTraining.intro.title }}
          </h2>
          <p class="mt-4 text-[16px] leading-[28px] text-ink-700">{{ excelTraining.intro.body }}</p>
          <p class="mt-4 font-display text-[17px] font-bold">{{ excelTraining.intro.price }}</p>
        </div>

        <div class="mt-14 grid gap-3 md:grid-cols-3">
          <div
            v-for="step in excelTraining.steps"
            :key="step.title"
            class="rounded-tile border border-line-ink p-6"
          >
            <h3 class="mb-2.5 text-[19px] leading-[26px]">{{ step.title }}</h3>
            <p class="text-[13px] leading-[1.5] text-ink-700">{{ step.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white px-[clamp(16px,4vw,40px)] pb-20">
      <div class="mx-auto grid max-w-[1400px] items-center gap-[clamp(32px,5vw,60px)] md:grid-cols-2">
        <div class="min-w-0">
          <h2 class="mb-5 text-[28px] leading-[44px] tracking-[-0.025em]">
            {{ excelTraining.pains.title }}
          </h2>
          <CheckList :items="excelTraining.pains.items" />
          <a href="#intake" class="btn-primary btn-lg mt-8 inline-flex">
            {{ excelTraining.pains.cta }} <BtnArrow />
          </a>
        </div>

        <div class="min-w-0 rounded-block bg-parchment p-8">
          <p class="kicker mb-2.5 text-[19px] leading-[19px]">{{ excelTraining.curriculum.kicker }}</p>
          <h2 class="mb-4 text-[28px] leading-[44px] tracking-[-0.025em]">
            {{ excelTraining.curriculum.title }}
          </h2>
          <p class="mb-7 text-[15px] leading-[28px] text-ink-700">
            {{ excelTraining.curriculum.body }}
          </p>

          <div v-for="group in excelTraining.curriculum.groups" :key="group.title" class="mb-6 last:mb-0">
            <p class="mb-2.5 font-display text-[15px] font-bold">{{ group.title }}</p>
            <CheckList :items="group.items" />
          </div>
        </div>
      </div>
    </section>

    <!-- Its own five questions, not the sitewide set. -->
    <section id="intake" class="scroll-mt-24 bg-parchment px-[clamp(16px,4vw,40px)] py-20">
      <div class="mx-auto grid max-w-[1100px] items-start gap-[clamp(24px,4vw,56px)] md:grid-cols-[40%_60%]">
        <div class="min-w-0">
          <h2 class="mb-1 text-[27px] leading-[44px]">{{ excelTraining.faq.title }}</h2>
          <p class="text-[16px] leading-[24px]">
            Staat je vraag er niet tussen?
            <a :href="contact.emailHref" class="border-b-[1.5px] border-ink-900 font-semibold">
              Neem contact op!
            </a>
          </p>
        </div>

        <div class="min-w-0 md:pl-6">
          <FaqList size="lg" :items="excelTraining.faq.items" />
        </div>
      </div>
    </section>
  </div>
</template>
