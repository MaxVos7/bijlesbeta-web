<script setup lang="ts">
import { contact, examentraining, faqIntro } from '~/data/site'

useSeoMeta({
  title: 'Examentraining',
  description: examentraining.hero.intro,
})

/*
  Promo-video reveal: a click swaps the play button for an embed. No real
  video has been supplied yet (the design handoff left this URL empty too —
  see chats/chat1.md) — paste the YouTube (Shorts) URL below and the embed
  starts working with no other changes.
*/
const YOUTUBE_URL = ''
const videoOpen = ref(false)
const videoId = computed(() => {
  const m = YOUTUBE_URL.match(/(?:shorts\/|watch\?v=|youtu\.be\/|embed\/)([\w-]{6,})/)
  return m ? m[1] : ''
})
const embedUrl = computed(() =>
  videoId.value ? `https://www.youtube.com/embed/${videoId.value}?autoplay=1&rel=0` : '',
)

function openVideo() {
  videoOpen.value = true
}
</script>

<template>
  <div>
    <!-- Hero: rating + promises on the left, the training photo on the right. -->
    <section class="bg-cream px-[clamp(16px,4vw,24px)] pt-[clamp(24px,3.5vw,44px)] pb-[clamp(40px,6vw,72px)]">
      <div
        class="mx-auto grid max-w-[1180px] items-center gap-[clamp(28px,4.5vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(330px,1fr))]"
      >
        <div class="min-w-0">
          <RatingLine :label="examentraining.hero.ratingLabel" class="mb-4" />

          <h1 class="mb-4 text-[clamp(27px,3.2vw,37px)] leading-[1.15] tracking-[-0.025em]">
            {{ examentraining.hero.title }}
          </h1>
          <p class="mb-[26px] max-w-[52ch] text-[15px] leading-[1.7] text-ink-600">
            {{ examentraining.hero.intro }}
          </p>

          <CheckList :items="examentraining.hero.promises" class="mb-[30px] font-semibold" />

          <a href="#aanmelden" class="btn-primary gap-3 px-5 py-[13px]">
            {{ examentraining.hero.cta }} <span aria-hidden="true" class="text-base">→</span>
          </a>
        </div>

        <div class="min-w-0">
          <img
            :src="examentraining.hero.image"
            :alt="examentraining.hero.imageAlt"
            class="block h-[clamp(240px,26vw,300px)] w-full rounded-panel object-cover"
          >
        </div>
      </div>
    </section>

    <!-- Why the training works: four cards. Icons are placeholders — no -->
    <!-- artwork was supplied for these in the design handoff. -->
    <section class="bg-white px-[clamp(16px,4vw,24px)] py-[clamp(48px,6vw,80px)]">
      <div class="mx-auto max-w-[1180px]">
        <div class="mb-[clamp(28px,3.6vw,42px)] text-center">
          <p class="kicker mb-2.5">{{ examentraining.features.kicker }}</p>
          <h2 class="text-[clamp(23px,2.7vw,31px)] tracking-[-0.025em]">
            {{ examentraining.features.title }}
          </h2>
        </div>

        <div
          class="grid gap-[clamp(14px,1.8vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]"
        >
          <div
            v-for="feature in examentraining.features.items"
            :key="feature.title"
            class="flex flex-col gap-3 rounded-tile border border-line-200 px-6 py-[26px] transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_28px_rgb(31_29_28_/_0.08)]"
          >
            <div
              class="flex h-20 w-20 items-center justify-center rounded-panel border border-dashed border-line-300 bg-mist"
              aria-hidden="true"
            >
              <svg
                class="h-7 w-7 text-ink-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
            <h3 class="mt-2 text-[17px] tracking-[-0.01em]">{{ feature.title }}</h3>
            <p class="text-sm leading-[1.62] text-ink-600">{{ feature.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Details on the left, the all-in-one package card on the right. -->
    <section class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(32px,4vw,56px)] pb-[clamp(48px,6vw,80px)]">
      <div
        class="mx-auto grid max-w-[1180px] items-start gap-[clamp(28px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      >
        <div class="min-w-0">
          <p class="kicker mb-2">{{ examentraining.details.kicker }}</p>
          <h2 class="mb-[18px] text-[clamp(23px,2.7vw,31px)] tracking-[-0.025em]">
            {{ examentraining.details.title }}
          </h2>
          <p class="mb-3.5 text-sm leading-[1.75] text-ink-700">{{ examentraining.details.intro }}</p>

          <p class="text-sm leading-[1.75] font-bold">{{ examentraining.details.planningLabel }}</p>
          <div
            class="mb-2.5 grid justify-start gap-x-2.5 gap-y-0.5 text-sm leading-[1.75] text-ink-700 [grid-template-columns:auto_1fr]"
          >
            <template v-for="row in examentraining.details.planning" :key="row.time">
              <span class="font-bold whitespace-nowrap text-ink-900">{{ row.time }}</span>
              <span>{{ row.label }}</span>
            </template>
          </div>

          <p class="text-sm leading-[1.75] font-bold">{{ examentraining.details.datesLabel }}</p>
          <p class="mb-2.5 text-sm leading-[1.75] text-ink-700">{{ examentraining.details.datesBody }}</p>

          <p class="text-sm leading-[1.75] font-bold">{{ examentraining.details.locationLabel }}</p>
          <p class="text-sm leading-[1.75] text-ink-700">{{ examentraining.details.locationLines[0] }}</p>
          <p class="text-sm leading-[1.75] text-ink-700">
            Ruime en rustige vergaderzaal van <em>Rapide Software</em>
          </p>

          <p class="mt-[26px] text-[13.5px] leading-[1.7] text-ink-700 italic">
            {{ examentraining.details.specialNoticeBefore }}
          </p>
          <p class="text-[13.5px] leading-[1.7] font-bold text-ink-900 italic">
            <template v-for="(item, index) in examentraining.details.specialTrainings" :key="item">
              <br v-if="index > 0">– {{ item }}
            </template>
          </p>
          <p class="text-[13.5px] leading-[1.7] text-ink-700 italic">
            {{ examentraining.details.specialNoticeAfter }}
          </p>
          <p class="text-[13.5px] leading-[1.7] font-bold text-ink-900 italic">
            {{ examentraining.details.specialLocation }}
          </p>
        </div>

        <div class="min-w-0 rounded-card bg-ink-900 p-[clamp(22px,2.6vw,30px)] text-white">
          <span
            class="mb-[18px] inline-block rounded-[7px] border border-accent-500 px-[11px] py-[5px] text-[12.5px] font-semibold text-brand-500"
          >
            {{ examentraining.pricing.badge }}
          </span>
          <h3 class="mb-2.5 text-[21px] tracking-[-0.02em] text-white">{{ examentraining.pricing.title }}</h3>
          <p class="mb-[26px] text-sm leading-[1.6] text-ink-300">{{ examentraining.pricing.blurb }}</p>
          <p class="mb-[26px] text-[22px] font-bold tracking-[-0.03em] text-white">
            €{{ examentraining.pricing.price }}
          </p>

          <ul class="mb-[26px] flex list-none flex-col gap-[11px] p-0">
            <li
              v-for="feature in examentraining.pricing.features"
              :key="feature"
              class="flex items-center gap-2.5 text-[14.5px] font-medium"
            >
              <svg
                class="h-[15px] w-[15px] flex-none text-success-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M4 12l6 6L20 6" />
              </svg>
              {{ feature }}
            </li>
          </ul>

          <a href="#aanmelden" class="btn-primary w-full gap-3 px-5 py-[13px]">
            {{ examentraining.pricing.cta }} <span aria-hidden="true" class="text-base">→</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Promo video: a click reveals the embed area. -->
    <section class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(32px,4vw,56px)] pb-[clamp(56px,7vw,90px)]">
      <div
        class="mx-auto grid max-w-[1180px] items-center gap-[clamp(28px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      >
        <div class="min-w-0">
          <h2 class="mb-3.5 text-[clamp(23px,2.6vw,30px)] tracking-[-0.025em]">
            {{ examentraining.video.title }}
          </h2>
          <p class="text-sm leading-[1.75] text-ink-700">{{ examentraining.video.body[0] }}</p>
          <p class="mb-[26px] text-sm leading-[1.75] text-ink-700">{{ examentraining.video.body[1] }}</p>
          <a href="#aanmelden" class="btn-primary gap-3 px-5 py-[13px]">
            {{ examentraining.video.cta }} <span aria-hidden="true" class="text-base">→</span>
          </a>
        </div>

        <div class="min-w-0">
          <button
            v-if="!videoOpen"
            type="button"
            :aria-label="examentraining.video.startLabel"
            class="flex h-[clamp(320px,34vw,440px)] w-full cursor-pointer items-center justify-center rounded-panel border-0 bg-transparent p-0"
            @click="openVideo"
          >
            <svg
              class="h-[74px] w-[74px] text-line-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </button>
          <div v-else class="flex h-[clamp(320px,34vw,440px)] items-center justify-center">
            <iframe
              v-if="embedUrl"
              :src="embedUrl"
              title="Promotievideo examentraining"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="h-full [aspect-ratio:9/16] rounded-panel border-0 bg-ink-900"
            />
            <p v-else class="max-w-[26ch] px-6 text-center text-sm text-ink-500">
              Video volgt binnenkort.
            </p>
          </div>
          <p class="mt-4 text-center text-[13px] text-ink-700">
            {{ examentraining.video.caption }}
          </p>
        </div>
      </div>
    </section>

    <!-- Levels: notice only, per the design — no level picker. -->
    <section class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(24px,3vw,40px)] pb-[clamp(48px,6vw,80px)]">
      <div class="mx-auto max-w-[1180px] text-center">
        <p class="kicker mb-2.5">{{ examentraining.levelsNotice.kicker }}</p>
        <h2 class="mb-[22px] text-[clamp(23px,2.7vw,31px)] tracking-[-0.025em]">
          {{ examentraining.levelsNotice.title }}
        </h2>
        <p class="mx-auto mb-3 max-w-[70ch] text-sm leading-[1.75] text-ink-700">
          <strong class="text-ink-900">{{ examentraining.levelsNotice.noticeLead }}</strong>
          {{ examentraining.levelsNotice.notice }}
        </p>
        <p class="mx-auto max-w-[70ch] text-sm leading-[1.75] text-ink-700">
          {{ examentraining.levelsNotice.body }}
        </p>
      </div>
    </section>

    <!-- Signup: WhatsApp/e-mail on the left, the contact form panel on the right. -->
    <section id="aanmelden" class="bg-sand px-[clamp(16px,4vw,24px)] pt-[clamp(40px,5.5vw,72px)] pb-[clamp(48px,7vw,88px)]">
      <div
        class="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(330px,1fr))]"
      >
        <div class="min-w-0">
          <p class="kicker mb-2.5">{{ examentraining.signup.kicker }}</p>
          <h2 class="mb-[18px] max-w-[14ch] text-[clamp(26px,3.4vw,38px)] leading-[1.15]">
            {{ examentraining.signup.title }}
          </h2>
          <p class="mb-3.5 max-w-[46ch] text-sm leading-[1.7] text-ink-700">
            <strong class="text-ink-900">{{ examentraining.signup.noticeLead }}</strong>
            {{ examentraining.signup.notice }}
          </p>
          <p class="mb-[30px] max-w-[46ch] text-sm leading-[1.7] text-ink-600">
            {{ examentraining.signup.body }}
          </p>

          <div class="flex flex-col gap-[18px]">
            <a
              :href="contact.whatsappHref"
              rel="noopener"
              class="flex items-center gap-4 text-[15px] font-bold transition hover:text-brand-700"
            >
              <span class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-brand-500 text-white">
                <svg class="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 1.8a8.2 8.2 0 016.9 12.6l-.2.3.7 2.6-2.7-.7-.3.2A8.2 8.2 0 1112 3.8zm-3.5 4c-.2 0-.5.1-.7.4-.3.3-.8.9-.8 1.9 0 1 .7 2 1 2.4.3.4 1.5 2.5 3.8 3.4 1.9.7 2.3.6 2.7.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3l-1.4-.7c-.2-.1-.4-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-1.8-1.1-.6-.6-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4l.4-.5c.1-.2.1-.3 0-.5l-.6-1.4c-.1-.3-.3-.3-.5-.3h-.6z"
                  />
                </svg>
              </span>
              {{ contact.whatsapp }}
            </a>
            <a
              :href="contact.applicationsEmailHref"
              class="flex items-center gap-4 text-[15px] font-bold transition hover:text-brand-700"
            >
              <span class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-brand-500 text-white">
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
              {{ contact.applicationsEmail }}
            </a>
          </div>
        </div>

        <div class="min-w-0">
          <ContactForm variant="panel" subject="Examentraining" />
        </div>
      </div>
    </section>

    <!-- FAQ: this page's own 3 questions, not the sitewide list. -->
    <section id="faq" class="bg-sand px-[clamp(16px,4vw,24px)] py-[clamp(56px,7vw,88px)]">
      <div class="mx-auto max-w-[1180px]">
        <div class="mb-[clamp(24px,3.2vw,36px)] text-center">
          <h2 class="mb-3 text-[clamp(24px,2.9vw,33px)] tracking-[-0.025em]">{{ faqIntro.title }}</h2>
          <p class="text-[14.5px] text-ink-700">
            {{ faqIntro.before }}
            <a href="#aanmelden" class="border-b-[1.5px] border-ink-900">{{ faqIntro.link }}</a>
          </p>
        </div>

        <div class="mx-auto max-w-[840px] rounded-card bg-white px-[clamp(18px,2.6vw,30px)] py-2.5">
          <FaqList size="lg" :items="examentraining.faqs" />
        </div>
      </div>
    </section>
  </div>
</template>
