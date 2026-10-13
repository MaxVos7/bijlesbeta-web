<script setup lang="ts">
import type { ConsentCategories } from '~/composables/useCookieConsent'
import { categoriesOf, levelOf } from '~/composables/useCookieConsent'
import { cookieConsent } from '~/data/site'

/**
 * The cookie banner: a floating card in the bottom-right corner with two views.
 * The first offers weigeren, accepteren and a way into the settings; the
 * settings view has a switch per category and saves whatever combination the
 * visitor sets, which `levelOf` turns into one of the four consent levels.
 *
 * It renders only when a choice hasn't been made — the cookie is read during
 * SSR, so there is no flash of a banner the visitor already dismissed.
 * Reopened from "Beheer cookies" with a choice stored, it goes straight to
 * the settings with the current switches, since that is what the visitor
 * came back to change.
 */
const { level, open, choose, restore } = useCookieConsent()

// A stored choice has to reach Consent Mode before Tag Manager acts on the
// defaults, so this runs as soon as the client picks up.
onMounted(restore)

/*
  The switches show the stored choice, and start off when there is none: a
  pre-ticked box is not valid consent under the GDPR (Planet49, CJEU 2019).
*/
const initial = (): ConsentCategories => categoriesOf(level.value)

const view = ref<'start' | 'instellingen'>(level.value ? 'instellingen' : 'start')
const keuze = reactive<ConsentCategories>(initial())

watch(open, (isOpen) => {
  if (!isOpen) return
  Object.assign(keuze, initial())
  view.value = level.value ? 'instellingen' : 'start'
})

function save() {
  choose(levelOf(keuze))
}
</script>

<template>
  <Transition
    enter-from-class="translate-y-6 opacity-0"
    enter-active-class="transition duration-300 ease-out"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="translate-y-6 opacity-0"
  >
    <div
      v-if="open"
      role="dialog"
      :aria-label="cookieConsent.ariaLabel"
      class="fixed inset-x-3 bottom-3 z-[999] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-block border border-line-ink bg-white p-5 shadow-float md:inset-x-auto md:bottom-6 md:right-6 md:w-[520px] md:p-7"
    >
      <p class="font-display text-[22px] leading-[1.3] font-bold">
        {{ cookieConsent.title }}
      </p>
      <p class="mt-2 text-[14px] leading-[24px] text-ink-700">
        {{ cookieConsent.body }}
        <NuxtLink
          :to="cookieConsent.policyTo"
          class="text-ink-800 underline decoration-ink-900 decoration-[1.5px] underline-offset-2 hover:text-brand-700"
        >{{ cookieConsent.policyLabel }}</NuxtLink>.
      </p>

      <div v-if="view === 'start'" class="mt-5 grid gap-2.5 sm:grid-cols-2">
        <button type="button" class="btn-secondary cursor-pointer sm:col-span-2" @click="view = 'instellingen'">
          {{ cookieConsent.customise }}
        </button>
        <button type="button" class="btn-secondary cursor-pointer px-3" @click="choose('deny')">
          {{ cookieConsent.deny }}
        </button>
        <button type="button" class="btn-primary cursor-pointer px-3" @click="choose('accept')">
          {{ cookieConsent.accept }}
        </button>
      </div>

      <template v-else>
        <ul class="mt-5 space-y-2.5">
          <li class="flex items-center gap-4 rounded-panel bg-linen px-4 py-3.5">
            <div class="min-w-0 flex-1">
              <p class="font-display text-[15px] leading-[22px] font-bold">{{ cookieConsent.necessary.title }}</p>
              <p class="mt-0.5 text-[13px] leading-[20px] text-ink-700">{{ cookieConsent.necessary.body }}</p>
            </div>
            <span class="text-[13px] text-ink-700">{{ cookieConsent.required }}</span>
            <span
              role="switch"
              aria-checked="true"
              aria-disabled="true"
              :aria-label="cookieConsent.necessary.title"
              class="relative h-6 w-11 flex-none rounded-full bg-brand-500 opacity-50"
            >
              <span class="absolute top-0.5 left-[22px] size-5 rounded-full bg-white shadow-panel" />
            </span>
          </li>

          <li
            v-for="cat in cookieConsent.categories"
            :key="cat.key"
            class="flex items-center gap-4 rounded-panel bg-linen px-4 py-3.5"
          >
            <div class="min-w-0 flex-1">
              <p :id="`consent-${cat.key}`" class="font-display text-[15px] leading-[22px] font-bold">
                {{ cat.title }}
              </p>
              <p class="mt-0.5 text-[13px] leading-[20px] text-ink-700">{{ cat.body }}</p>
            </div>
            <span class="text-[13px] text-ink-700" aria-hidden="true">
              {{ keuze[cat.key] ? cookieConsent.on : cookieConsent.off }}
            </span>
            <button
              type="button"
              role="switch"
              :aria-checked="keuze[cat.key]"
              :aria-labelledby="`consent-${cat.key}`"
              class="relative h-6 w-11 flex-none cursor-pointer rounded-full transition-colors"
              :class="keuze[cat.key] ? 'bg-brand-500' : 'bg-ink-900/15'"
              @click="keuze[cat.key] = !keuze[cat.key]"
            >
              <span
                class="absolute top-0.5 size-5 rounded-full bg-white shadow-panel transition-[left]"
                :class="keuze[cat.key] ? 'left-[22px]' : 'left-0.5'"
              />
            </button>
          </li>
        </ul>

        <div class="mt-5 grid gap-2.5">
          <button type="button" class="btn-secondary cursor-pointer" @click="view = 'start'">
            {{ cookieConsent.back }}
          </button>
          <button type="button" class="btn-primary cursor-pointer" @click="save">
            {{ cookieConsent.save }}
          </button>
        </div>
      </template>
    </div>
  </Transition>
</template>
