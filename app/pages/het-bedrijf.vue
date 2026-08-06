<script setup lang="ts">
import { hetBedrijf } from '~/data/site'

useSeoMeta({
  title: 'Het bedrijf',
  description:
    'Het verhaal van Bijles Bèta: hoe we in 2017 zijn begonnen, onze aanpak, ons team van bèta-studenten en de innovaties die onze bijles efficiënt houden.',
})
</script>

<template>
  <div>
    <section
      id="top"
      class="bg-cream px-[clamp(16px,4vw,24px)] pt-[clamp(28px,4vw,48px)] pb-[clamp(48px,7vw,84px)]"
    >
      <div
        class="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      >
        <div class="min-w-0">
          <RatingLine class="mb-3.5" />
          <h1
            class="mb-[18px] text-[clamp(28px,3.6vw,42px)] leading-[1.14] tracking-[-0.03em] text-pretty"
          >
            {{ hetBedrijf.hero.title }}
          </h1>
          <p class="mb-[26px] max-w-[48ch] text-[clamp(15px,1.2vw,16px)] leading-[1.7] text-ink-600 text-pretty">
            {{ hetBedrijf.hero.body }}
          </p>
          <a
            href="#verhaal"
            class="btn-primary gap-3.5 px-6 py-[15px] text-[15px] shadow-[0_6px_18px_rgb(255_187_0_/_0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgb(255_187_0_/_0.42)]"
          >
            Het ontstaan <span class="text-lg" aria-hidden="true">→</span>
          </a>
        </div>

        <div class="min-w-0">
          <img
            :src="hetBedrijf.hero.image"
            :alt="hetBedrijf.hero.imageAlt"
            class="block aspect-[4/3] h-auto w-full rounded-tile object-cover"
          >
        </div>
      </div>
    </section>

    <section
      id="verhaal"
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(48px,6vw,88px)] pb-[clamp(40px,5vw,64px)]"
    >
      <div
        class="mx-auto grid max-w-[1180px] gap-[clamp(32px,5vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))]"
      >
        <div class="min-w-0">
          <h2 class="mb-4 text-[clamp(24px,2.6vw,30px)] tracking-[-0.025em]">{{ hetBedrijf.verhaal.title }}</h2>
          <p class="text-[14.5px] leading-[1.75] text-ink-700 text-pretty">{{ hetBedrijf.verhaal.body }}</p>
        </div>
        <img
          :src="hetBedrijf.verhaal.image"
          :alt="hetBedrijf.verhaal.imageAlt"
          class="block aspect-[3/2] h-auto w-full rounded-tile object-cover"
          loading="lazy"
        >

        <img
          :src="hetBedrijf.aanpak.image"
          :alt="hetBedrijf.aanpak.imageAlt"
          class="block aspect-[3/2] h-auto w-full rounded-tile object-cover"
          loading="lazy"
        >
        <div class="min-w-0">
          <h2 class="mb-4 text-[clamp(24px,2.6vw,30px)] tracking-[-0.025em]">{{ hetBedrijf.aanpak.title }}</h2>
          <p
            v-for="(paragraph, index) in hetBedrijf.aanpak.body"
            :key="paragraph"
            class="text-[14.5px] leading-[1.75] text-ink-700 text-pretty"
            :class="index === hetBedrijf.aanpak.body.length - 1 ? 'mb-[26px]' : 'mb-3'"
          >
            {{ paragraph }}
          </p>
          <NuxtLink to="/aanmelden" class="btn-primary gap-3 px-5 py-[13px] text-sm">
            Meld je aan <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>

        <div class="min-w-0">
          <h2 class="mb-4 text-[clamp(24px,2.6vw,30px)] tracking-[-0.025em]">{{ hetBedrijf.team.title }}</h2>
          <p class="mb-3 text-[14.5px] leading-[1.75] text-ink-700">{{ hetBedrijf.team.body }}</p>
          <p class="mb-[26px] text-[14.5px] leading-[1.75] text-ink-700">
            {{ hetBedrijf.team.buddyBefore }}<strong class="font-bold text-ink-800">{{ hetBedrijf.team.buddyBold }}</strong>{{ hetBedrijf.team.buddyAfter }}
          </p>
          <NuxtLink to="/over-ons#team" class="btn-primary gap-3 px-5 py-[13px] text-sm">
            Ons team <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
        <img
          :src="hetBedrijf.team.image"
          :alt="hetBedrijf.team.imageAlt"
          class="block aspect-[3/2] h-auto w-full rounded-tile object-cover"
          loading="lazy"
        >
      </div>
    </section>

    <section
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(40px,5vw,64px)] pb-[clamp(56px,7vw,90px)]"
    >
      <div class="mx-auto max-w-[1180px]">
        <p class="kicker mb-2.5">{{ hetBedrijf.innovaties.kicker }}</p>
        <h2 class="mb-5 max-w-[36ch] text-[clamp(24px,2.9vw,33px)] tracking-[-0.025em] text-pretty">
          {{ hetBedrijf.innovaties.title }}
        </h2>
        <p
          v-for="(paragraph, index) in hetBedrijf.innovaties.intro"
          :key="paragraph"
          class="max-w-[70ch] text-[14.5px] leading-[1.75] text-ink-700 text-pretty"
          :class="index === hetBedrijf.innovaties.intro.length - 1 ? 'mb-[clamp(28px,3.5vw,44px)]' : 'mb-3'"
        >
          {{ paragraph }}
        </p>

        <div class="flex flex-col gap-[clamp(26px,3vw,38px)]">
          <div v-for="(item, index) in hetBedrijf.innovaties.items" :key="item.title">
            <h3 class="mb-3 text-[17px]">{{ index + 1 }}. {{ item.title }}</h3>
            <p
              v-for="(paragraph, pIndex) in item.body"
              :key="paragraph"
              class="text-[14.5px] leading-[1.75] text-ink-700"
              :class="pIndex === item.body.length - 1 ? '' : 'mb-2.5'"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <FaqSection />
  </div>
</template>
