<script setup lang="ts">
import { contact, trialCta } from '~/data/site'

/**
 * The amber block that closes most pages: the pitch on the left, a short
 * callback form on the right.
 *
 * The form collects only name, phone and email, so it synthesises the message
 * body that /api/contact requires — the request itself is the message.
 */
const form = reactive({
  name: '',
  phone: '',
  email: '',
  consent: false,
  // Honeypot — bots fill this, humans never see it.
  website: '',
})

const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const message = ref('')

async function submit() {
  if (status.value === 'pending') return

  if (!form.name.trim() || !form.email.trim() || !form.consent) {
    status.value = 'error'
    message.value = 'Vul je naam en e-mailadres in en ga akkoord met het privacybeleid.'
    return
  }

  status.value = 'pending'
  message.value = ''

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: 'Gratis proefles',
        message: 'Aanvraag voor een gratis proefles via de website.',
        website: form.website,
      },
    })
    status.value = 'success'
  } catch (error: any) {
    status.value = 'error'
    message.value =
      error?.data?.message ??
      'Er ging iets mis bij het versturen. Probeer het later opnieuw of bel ons.'
  }
}
</script>

<template>
  <section class="bg-white px-[clamp(16px,4vw,24px)] pb-[clamp(56px,7vw,88px)]">
    <div
      class="mx-auto grid max-w-[1040px] items-start gap-[clamp(26px,3.5vw,44px)] rounded-[20px] bg-brand-500 p-[clamp(26px,3.5vw,44px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
    >
      <div class="min-w-0">
        <p class="mb-2 text-[15px] font-semibold text-on-brand">{{ trialCta.kicker }}</p>
        <h2 class="mb-3.5 text-[clamp(23px,2.6vw,31px)] tracking-[-0.025em]">
          {{ trialCta.title }}
        </h2>
        <p class="mb-6 max-w-[44ch] text-[14.5px] leading-relaxed text-on-brand-muted">
          {{ trialCta.body }}
        </p>

        <CheckList :items="trialCta.promises" variant="tight" class="mb-7" />

        <div class="flex max-w-[360px] items-center gap-3.5 rounded-tile bg-sand p-3.5">
          <img
            src="https://bijlesbeta.nl/wp-content/uploads/2025/05/fbc1de12-fca2-4a3b-b508-6b46284a3ab6-e1746866164238.png"
            alt=""
            class="h-[58px] w-[58px] flex-none rounded-panel object-cover"
            width="58"
            height="58"
            loading="lazy"
          >
          <div class="min-w-0">
            <p class="text-[12.5px] text-ink-600">Sneller contact?</p>
            <p class="mt-0.5 mb-1 text-[17px] font-bold">{{ contact.whatsapp }}</p>
            <a
              :href="contact.whatsappHref"
              rel="noopener"
              class="inline-flex items-center gap-1.5 border-b-[1.5px] border-ink-900 text-[13px] font-semibold whitespace-nowrap"
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

      <div class="min-w-0 rounded-tile bg-white p-[clamp(18px,2vw,24px)]">
        <div v-if="status === 'success'" class="py-6 text-center" role="status">
          <h3 class="text-[17px]">Bedankt voor je bericht!</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-700">
            We nemen snel contact met je op om de proefles in te plannen.
          </p>
        </div>

        <form v-else class="flex flex-col gap-3.5" novalidate @submit.prevent="submit">
          <label class="sr-only" for="trial-name">Naam</label>
          <input id="trial-name" v-model="form.name" class="field-input mt-0" type="text" placeholder="Naam" autocomplete="name">

          <label class="sr-only" for="trial-phone">Telefoonnummer</label>
          <input id="trial-phone" v-model="form.phone" class="field-input mt-0" type="tel" placeholder="Telefoonnummer" autocomplete="tel">

          <label class="sr-only" for="trial-email">E-mailadres</label>
          <input id="trial-email" v-model="form.email" class="field-input mt-0" type="email" placeholder="E-mailadres" autocomplete="email">

          <label class="group flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-normal text-ink-700">
            <input v-model="form.consent" class="sr-only" type="checkbox">
            <span
              class="mt-px flex h-[18px] w-[18px] flex-none items-center justify-center rounded border-[1.5px] border-line-400 transition group-has-[:checked]:border-accent-500 group-has-[:checked]:bg-accent-400 group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-accent-500"
            >
              <svg
                class="h-[11px] w-[11px] opacity-0 group-has-[:checked]:opacity-100"
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
            </span>
            <span>
              Ik ga akkoord met het
              <NuxtLink to="/privacy" class="border-b border-ink-900">privacybeleid</NuxtLink>.<span
                class="text-danger"
              > (Vereist)</span>
            </span>
          </label>

          <div aria-hidden="true" class="absolute left-[-9999px]">
            <label for="trial-website">Laat dit veld leeg</label>
            <input id="trial-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off">
          </div>

          <p v-if="status === 'error'" class="text-[12.5px] text-danger" role="alert">{{ message }}</p>

          <button type="submit" class="btn-primary py-[15px] text-[15px]" :disabled="status === 'pending'">
            {{ status === 'pending' ? 'Versturen…' : 'Proefles claimen' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
