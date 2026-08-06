<script setup lang="ts">
import { findTutor, otherTutors } from '~/data/tutors'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const tutor = computed(() => findTutor(slug.value))

if (!tutor.value) {
  throw createError({ statusCode: 404, statusMessage: 'Docent niet gevonden', fatal: true })
}

const others = computed(() => otherTutors(slug.value, 4))

useSeoMeta({
  title: () => `${tutor.value?.name} — bijlesdocent`,
  description: () =>
    `${tutor.value?.name} geeft bijles in ${tutor.value?.expertise.join(', ')} en studeert ${tutor.value?.study} aan de Rijksuniversiteit Groningen.`,
})
</script>

<template>
  <div v-if="tutor">
    <section
      class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(28px,4vw,52px)] pb-[clamp(40px,5vw,64px)]"
    >
      <div class="mx-auto max-w-[1180px]">
        <NuxtLink
          to="/over-ons#team"
          class="mb-[22px] inline-flex items-center gap-2 text-[13.5px] font-semibold text-ink-600 hover:text-brand-700"
        >
          ← Terug naar het team
        </NuxtLink>

        <div
          class="grid items-start gap-[clamp(28px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
        >
          <div class="min-w-0">
            <h1 class="mb-4 text-[clamp(26px,3.2vw,36px)] tracking-[-0.03em]">{{ tutor.name }}</h1>

            <ul class="mb-6 flex list-none flex-wrap gap-2.5 p-0">
              <li
                v-for="subject in tutor.expertise"
                :key="subject"
                class="rounded-lg border border-line-200 bg-cream px-3.5 py-[7px] text-[13px] font-medium whitespace-nowrap"
              >
                {{ subject }}
              </li>
            </ul>

            <div class="flex flex-col gap-3.5">
              <p
                v-for="(paragraph, index) in tutor.bio"
                :key="index"
                class="max-w-[72ch] text-sm leading-[1.7] text-ink-700"
              >
                {{ paragraph }}
              </p>
            </div>

            <p class="mt-6 text-[13.5px] text-ink-600">
              Studie: <strong class="text-ink-800">{{ tutor.study }}</strong>
            </p>
          </div>

          <div class="flex min-w-0 flex-col items-start gap-[22px]">
            <img
              :src="tutor.photo"
              :alt="tutor.name"
              class="block aspect-[4/5] w-full max-w-[340px] rounded-md bg-sand object-cover"
            >
            <NuxtLink to="/aanmelden" class="btn-primary gap-3.5 px-[22px] py-3.5 text-[14.5px]">
              Bijles aanvragen <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white px-[clamp(16px,4vw,24px)] pb-[clamp(48px,6vw,80px)]">
      <div class="mx-auto max-w-[1180px]">
        <h2 class="mb-5 text-[clamp(19px,2vw,23px)] tracking-[-0.02em]">Andere docenten</h2>
        <div
          class="grid gap-[clamp(14px,1.6vw,20px)] [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]"
        >
          <TutorCard v-for="other in others" :key="other.slug" :tutor="other" :show-arrow="false" />
        </div>
      </div>
    </section>

    <TrialCta />
  </div>
</template>
