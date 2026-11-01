<script setup lang="ts">
import {
  facturen,
  losseLessen,
  pakkettenCta,
  pakkettenFaqs,
  pakkettenPage,
  pakketSteps,
  tegoed,
  uren,
  vakantie,
} from '~/data/pakketten'

useSeo({ title: pakkettenPage.seoTitle, description: pakkettenPage.seoDescription })

const blockClass: Record<string, string> = {
  package: 'border-brand-500 bg-brand-500',
  credit: 'border-dashed border-brand-500 bg-brand-500/55',
  extra: 'border-ink-800 bg-ink-800',
  unused: 'border-brand-500',
}
const barClass: Record<string, string> = {
  brand: 'bg-brand-500 text-on-brand',
  soft: 'border border-line-ink bg-sand',
  void: 'border border-dashed border-ink-900/20 text-ink-700',
}
</script>

<template>
  <div class="bg-parchment px-[clamp(16px,4vw,40px)] pt-10 pb-16 md:pt-16 md:pb-20">
    <div class="mx-auto flex max-w-[860px] flex-col gap-12 md:gap-16">
      <!-- Hero -->
      <header class="flex max-w-[680px] flex-col gap-3.5 md:gap-4">
        <p class="kicker">{{ pakkettenPage.kicker }}</p>
        <h1 class="text-[32px] leading-[1.2] md:text-[44px]">{{ pakkettenPage.title }}</h1>
        <p class="text-[17px] leading-[1.65] md:text-lg">{{ pakkettenPage.intro }}</p>
        <div class="mt-2 flex flex-wrap items-center gap-3">
          <NuxtLink to="/aanmelden" class="btn-primary btn-lg max-md:w-full max-md:justify-center">
            {{ pakkettenPage.primaryCta }} <BtnArrow />
          </NuxtLink>
          <a
            href="#vragen"
            class="border-b-[1.5px] border-ink-900/25 py-3 font-display text-base font-bold text-ink-800"
          >
            {{ pakkettenPage.faqCta }}
          </a>
        </div>
      </header>

      <!-- Four steps -->
      <section id="stappen" class="flex flex-col gap-4 md:gap-5">
        <h2 class="text-2xl leading-tight md:text-[30px]">Een pakket in vier stappen</h2>
        <article
          v-for="(step, i) in pakketSteps"
          :key="step.title"
          class="grid grid-cols-[36px_1fr] gap-x-3.5 gap-y-1 rounded-card border border-line-ink bg-white p-4 md:grid-cols-[40px_1fr] md:gap-x-4 md:p-5"
        >
          <div
            class="row-span-2 grid h-9 w-9 place-items-center rounded-full bg-brand-500 font-display text-[15px] font-extrabold text-on-brand md:h-10 md:w-10 md:text-base"
          >
            {{ i + 1 }}
          </div>
          <h3 class="text-base leading-snug md:text-[17px]">{{ step.title }}</h3>
          <p class="text-[15px] leading-relaxed md:text-base">{{ step.body }}</p>
        </article>
      </section>

      <!-- Holidays -->
      <section class="flex flex-col gap-4 md:gap-5">
        <h2 class="text-2xl leading-tight md:text-[30px]">{{ vakantie.title }}</h2>
        <p class="max-w-[62ch] text-[15px] md:text-base">{{ vakantie.body }}</p>
        <div class="flex flex-col gap-4 rounded-block border border-line-ink bg-white p-4 md:p-6">
          <div class="flex flex-col gap-2">
            <span class="font-display text-[13px] font-bold md:text-sm">{{ vakantie.withoutLabel }}</span>
            <PakketWeeks :cells="vakantie.without" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-display text-[13px] font-bold md:text-sm">{{ vakantie.withLabel }}</span>
            <PakketWeeks :cells="vakantie.with" />
          </div>
          <p class="text-[13px] leading-normal text-ink-700 md:text-sm">{{ vakantie.caption }}</p>
        </div>

        <h3 class="mt-2 text-[17px]">{{ vakantie.summerTitle }}</h3>
        <p class="max-w-[62ch] text-[15px] md:text-base">{{ vakantie.summerBody }}</p>
        <div class="flex flex-col gap-3 rounded-block border border-line-ink bg-white p-4 md:p-6">
          <span class="font-display text-[13px] font-bold md:text-sm">{{ vakantie.summerLabel }}</span>
          <PakketWeeks :cells="vakantie.summer" />
          <p class="text-[13px] leading-normal text-ink-700 md:text-sm">{{ vakantie.summerCaption }}</p>
        </div>
      </section>

      <!-- Hours -->
      <section class="flex flex-col gap-4 md:gap-5">
        <h2 class="text-2xl leading-tight md:text-[30px]">{{ uren.title }}</h2>
        <p class="max-w-[62ch] text-[15px] md:text-base">{{ uren.body }}</p>
        <div class="grid gap-3 md:grid-cols-3">
          <div
            v-for="o in uren.outcomes"
            :key="o.title"
            class="flex flex-col gap-1.5 rounded-card border border-line-ink bg-white p-4 md:p-5"
          >
            <h3 class="text-base md:text-[17px]">{{ o.title }}</h3>
            <p class="text-[15px] leading-relaxed">{{ o.body }}</p>
          </div>
        </div>

        <div class="flex flex-col gap-5 rounded-block border border-line-ink bg-white p-4 md:p-6">
          <span class="font-display text-[13px] font-bold md:text-sm">{{ uren.exampleTitle }}</span>
          <div v-for="period in uren.periods" :key="period.title" class="flex flex-col gap-2.5">
            <div class="flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-4">
              <h3 class="text-base md:text-[17px]">{{ period.title }}</h3>
              <span class="text-[13px] text-ink-700 md:text-sm">{{ period.sub }}</span>
            </div>
            <div class="flex flex-wrap gap-[5px]" role="img" :aria-label="period.title">
              <span
                v-for="(kind, i) in period.blocks"
                :key="i"
                class="h-7 w-7 rounded-btn border-2"
                :class="blockClass[kind]"
              />
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -- static copy from app/data -->
            <p class="text-[15px]" v-html="period.resultHtml" />
          </div>
          <div class="flex flex-col gap-1.5 text-[13px] text-ink-700 md:flex-row md:flex-wrap md:gap-x-5 md:gap-y-2">
            <span v-for="l in uren.legend" :key="l.kind" class="inline-flex items-center gap-2">
              <i class="h-3.5 w-3.5 rounded-[3px] border-2" :class="blockClass[l.kind]" />
              {{ l.label }}
            </span>
          </div>
        </div>
      </section>

      <!-- Credit -->
      <section class="flex flex-col gap-3.5 md:gap-5">
        <h2 class="text-2xl leading-tight md:text-[30px]">{{ tegoed.title }}</h2>
        <p v-for="p in tegoed.paragraphs" :key="p" class="max-w-[62ch] text-[15px] md:text-base">{{ p }}</p>
        <div class="flex flex-col gap-1 md:grid md:[grid-template-columns:5fr_2fr_1.4fr]">
          <div
            v-for="b in tegoed.bar"
            :key="b.title"
            class="rounded-btn p-3 text-[13px] leading-[1.4] font-semibold"
            :class="barClass[b.kind]"
          >
            {{ b.title }}
            <div v-if="b.sub" class="font-normal">{{ b.sub }}</div>
          </div>
        </div>
        <p class="text-[13px] text-ink-700 md:text-sm">{{ tegoed.caption }}</p>
      </section>

      <!-- Invoices -->
      <section id="facturen" class="flex flex-col gap-3.5 md:gap-5">
        <h2 class="text-2xl leading-tight md:text-[30px]">{{ facturen.title }}</h2>
        <div class="grid gap-3 md:grid-cols-2">
          <div
            v-for="i in facturen.items"
            :key="i.title"
            class="flex flex-col gap-1.5 rounded-card border border-line-ink bg-white p-[18px] md:gap-2 md:p-6"
          >
            <span
              class="self-start rounded-full border border-line-ink bg-sand px-2.5 font-display text-[11px] leading-[1.6] font-bold tracking-[0.06em] uppercase md:text-xs"
            >
              {{ i.tag }}
            </span>
            <h3 class="text-base md:text-[17px]">{{ i.title }}</h3>
            <p class="text-[15px] leading-relaxed">{{ i.body }}</p>
          </div>
        </div>
        <p class="max-w-[62ch] text-[15px] md:text-base">{{ facturen.after }}</p>
      </section>

      <!-- No package -->
      <section class="flex flex-col gap-3.5 md:gap-5">
        <h2 class="text-2xl leading-tight md:text-[30px]">{{ losseLessen.title }}</h2>
        <p class="max-w-[62ch] text-[15px] md:text-base">{{ losseLessen.body }}</p>
        <NuxtLink
          :to="losseLessen.link.to"
          class="self-start border-b-[1.5px] border-ink-900/25 py-2.5 font-display text-[15px] font-bold text-ink-800"
        >
          {{ losseLessen.link.label }} →
        </NuxtLink>
      </section>

      <!-- FAQ -->
      <section id="vragen" class="flex flex-col gap-3.5 md:gap-5">
        <h2 class="text-2xl leading-tight md:text-[30px]">Veelgestelde vragen</h2>
        <div class="border-t border-line-ink">
          <details v-for="f in pakkettenFaqs" :key="f.question" class="group border-b border-line-ink">
            <summary
              class="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3.5 font-display text-[15px] leading-snug font-bold md:py-[18px] md:text-base"
            >
              <span>{{ f.question }}</span>
              <span class="text-[22px] leading-none text-on-brand group-open:hidden" aria-hidden="true">+</span>
              <span class="hidden text-[22px] leading-none text-on-brand group-open:inline" aria-hidden="true">−</span>
            </summary>
            <p class="max-w-[62ch] pb-5 text-[15px] md:text-base">{{ f.answer }}</p>
          </details>
        </div>
      </section>

      <!-- CTA -->
      <section
        class="flex flex-col items-stretch gap-3 rounded-block bg-brand-500 px-5 py-7 text-on-brand md:items-start md:gap-3.5 md:px-7 md:py-9"
      >
        <h2 class="text-2xl leading-tight md:text-[30px]">{{ pakkettenCta.title }}</h2>
        <p class="text-[15px] md:text-base">{{ pakkettenCta.body }}</p>
        <NuxtLink to="/aanmelden" class="btn btn-lg justify-center bg-ink-900 text-white hover:bg-ink-800">
          {{ pakkettenCta.button }}
        </NuxtLink>
      </section>
    </div>
  </div>
</template>
