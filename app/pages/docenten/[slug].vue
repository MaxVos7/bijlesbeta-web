<script setup lang="ts">
import { findTutor } from '~/data/tutors'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const tutor = computed(() => findTutor(slug.value))

if (!tutor.value) {
  throw createError({ statusCode: 404, statusMessage: 'Docent niet gevonden', fatal: true })
}

useSeo({
  // The live profile titles are the docent's name and nothing else.
  title: () => tutor.value?.name ?? 'Docent',
  description: () =>
    `${tutor.value?.name} geeft bijles in ${tutor.value?.expertise.join(', ')} en studeert ${tutor.value?.study} aan de Rijksuniversiteit Groningen.`,
  image: tutor.value?.photo,
})
</script>

<!--
  The docent profile, measured against bijlesbeta.nl's single-post template
  (`/kennisbank/docenten/<slug>/`, Elementor post 827) rather than designed.
  `post-827.css` is the source for every number below; a few of them are
  deliberate and shouldn't be tidied:

  - **The page is one block, not several.** A 30px spacer, then a single
    container that holds the whole profile, then the shared proefles block and
    a 4rem spacer. The live page has no back-link, no `Studie:` line and no
    related-docenten grid — earlier versions of this page invented all three.
  - **The card is transparent.** `afeaedb` carries the 12px block radius but
    no ground of its own, so on the white band the 28px padding is all you
    see. Don't give it a fill to "make the radius do something".
  - **70 / 27 with a 36px gutter**, inside a column that is itself inset 36px,
    and both columns are inset another 28px. The percentages don't quite add
    up to the 972px they sit in — that is the live page's arithmetic, so the
    columns are allowed to shrink the last few pixels rather than overflow.
  - **The photograph is a flat 434px crop at every width**, on the 8px surface
    radius, and it does not step down on a phone.
  - **The break is Elementor's 1024, not Tailwind's `lg`** — the row stacks and
    the right column widens to 50% between 768 and 1024, so `desk:` (1025px)
    is the switch, with `md:` for the 768 floor.
  - **The subject pills are `parchment` at 4px**, 15px/600, from the live
    widget's custom CSS. bijlesbeta.nl also inherits `--e-global-color-secondary`
    onto their labels, which paints them white on that near-white ground; we
    keep the label in the body ink instead, the same way the header's typos are
    corrected rather than copied.
-->
<template>
  <div v-if="tutor" class="bg-white">
    <div class="h-[30px]" />

    <section class="px-[clamp(16px,4vw,40px)]">
      <div class="mx-auto max-w-[1100px]">
        <!-- The 36px inset column; flat on tablet and below. -->
        <div class="desk:px-9">
          <!-- The 12px block. No ground of its own — see the note above. -->
          <div class="rounded-block">
            <div class="flex flex-col gap-9 p-7 desk:flex-row">
              <div class="min-w-0 desk:w-[70%]">
                <h1
                  class="mb-3 max-w-[85%] text-[clamp(26px,3.2vw,32px)] leading-[42px] tracking-[-0.03em]"
                >
                  {{ tutor.name }}
                </h1>

                <ul
                  class="mb-3 flex list-none flex-col flex-wrap items-start gap-2.5 p-0 md:flex-row md:items-center"
                >
                  <li
                    v-for="subject in tutor.expertise"
                    :key="subject"
                    class="rounded-field bg-parchment px-3 py-1 text-[15px] font-semibold whitespace-nowrap"
                  >
                    {{ subject }}
                  </li>
                </ul>

                <div>
                  <p
                    v-for="(paragraph, index) in tutor.bio"
                    :key="index"
                    class="mb-[0.9rem] text-base leading-6 last:mb-0"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </div>

              <div class="flex min-w-0 flex-col justify-center gap-6 md:w-1/2 desk:w-[27%]">
                <img
                  :src="tutor.photo"
                  :alt="tutor.name"
                  class="block h-[434px] w-full rounded-panel bg-sand object-cover object-center"
                >
                <NuxtLink to="/aanmelden" class="btn-primary btn-lg self-start">
                  Bijles aanvragen <BtnArrow />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <TrialCta />

    <div class="h-16" />
  </div>
</template>
