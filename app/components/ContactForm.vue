<script setup lang="ts">
import { contactFormSuccess, contactPage } from '~/data/site'

const props = withDefaults(
  defineProps<{
    /** Prefilled subject, e.g. "Sollicitatie docent". Sent along with the message. */
    subject?: string
    /**
     * `labelled` is the plain form that sits in a page's own layout.
     * `panel` is the contact page's white card: it carries its own heading, the
     * name is split in two, the phone field is dropped, placeholders stand in
     * for labels and consent to the privacy statement is required.
     */
    variant?: 'labelled' | 'panel'
  }>(),
  { subject: 'Algemene vraag', variant: 'labelled' },
)

const panel = computed(() => props.variant === 'panel')
const copy = contactPage.form

const form = reactive({
  name: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  privacy: false,
  // Honeypot — bots fill this, humans never see it.
  website: '',
})

const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const errors = ref<Record<string, string>>({})
const errorMessage = ref('')

/*
  The panel's fields are placeholder-only, so they carry no top margin —
  `field-input` reserves one for the label it normally sits under.
*/
const panelInput =
  'block w-full rounded-field border border-line-300 bg-white px-3.5 py-[13px] ' +
  'text-[13.5px] text-ink-800 transition placeholder:text-ink-300 ' +
  'focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/25'

/** The endpoint takes one name field, whichever way the form collects it. */
const fullName = () =>
  panel.value ? `${form.firstName.trim()} ${form.lastName.trim()}`.trim() : form.name.trim()

function validate() {
  const next: Record<string, string> = {}

  if (panel.value) {
    if (!form.firstName.trim()) next.firstName = 'Vul je voornaam in.'
    if (!form.lastName.trim()) next.lastName = 'Vul je achternaam in.'
    if (!form.privacy) next.privacy = 'Ga akkoord met het privacybeleid om te versturen.'
  } else if (!form.name.trim()) {
    next.name = 'Vul je naam in.'
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = 'Vul een geldig e-mailadres in.'
  if (form.message.trim().length < 10) next.message = 'Vertel ons iets meer (minimaal 10 tekens).'

  errors.value = next
  return Object.keys(next).length === 0
}

async function submit() {
  if (status.value === 'pending' || !validate()) return

  status.value = 'pending'
  errorMessage.value = ''

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: fullName(),
        email: form.email,
        phone: form.phone,
        message: form.message,
        website: form.website,
        subject: props.subject,
      },
    })
    status.value = 'success'
  } catch (error: any) {
    status.value = 'error'
    errorMessage.value =
      error?.data?.message ??
      'Er ging iets mis bij het versturen. Probeer het later opnieuw of bel ons.'
  }
}
</script>

<template>
  <div
    :class="
      panel && 'panel px-[clamp(20px,2.4vw,28px)] pt-[clamp(22px,2.6vw,30px)] pb-[clamp(24px,2.8vw,32px)]'
    "
  >
    <div v-if="status === 'success' && panel" role="status">
      <p class="kicker text-center">{{ copy.kicker }}</p>
      <h2 class="mt-1.5 text-center text-[clamp(21px,2.2vw,26px)] tracking-[-0.02em]">
        {{ contactFormSuccess.title }}
      </h2>
      <p class="mt-4 text-center text-[13.5px] leading-[1.7] text-ink-700">
        {{ contactFormSuccess.body }}
      </p>
    </div>

    <div
      v-else-if="status === 'success'"
      class="rounded-xl border border-green-200 bg-green-50 p-6"
      role="status"
    >
      <h3 class="text-lg text-green-900">{{ contactFormSuccess.title }}</h3>
      <p class="mt-2 text-green-800">{{ contactFormSuccess.body }}</p>
    </div>

    <form v-else :class="!panel && 'space-y-5'" novalidate @submit.prevent="submit">
      <template v-if="panel">
        <p class="kicker mb-1.5 text-center">{{ copy.kicker }}</p>
        <h2 class="mb-[22px] text-center text-[clamp(21px,2.2vw,26px)] tracking-[-0.02em]">
          {{ copy.title }}
        </h2>

        <div class="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
          <div>
            <input
              v-model="form.firstName"
              type="text"
              autocomplete="given-name"
              :placeholder="copy.firstName"
              :aria-label="copy.firstName"
              :aria-invalid="Boolean(errors.firstName)"
              :class="panelInput"
            >
            <p v-if="errors.firstName" class="field-error">{{ errors.firstName }}</p>
          </div>

          <div>
            <input
              v-model="form.lastName"
              type="text"
              autocomplete="family-name"
              :placeholder="copy.lastName"
              :aria-label="copy.lastName"
              :aria-invalid="Boolean(errors.lastName)"
              :class="panelInput"
            >
            <p v-if="errors.lastName" class="field-error">{{ errors.lastName }}</p>
          </div>
        </div>

        <div class="mt-3">
          <input
            v-model="form.email"
            type="email"
            autocomplete="email"
            :placeholder="copy.email"
            :aria-label="copy.email"
            :aria-invalid="Boolean(errors.email)"
            :class="panelInput"
          >
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>

        <div class="mt-3">
          <textarea
            v-model="form.message"
            rows="7"
            :placeholder="copy.message"
            :aria-label="copy.message"
            :aria-invalid="Boolean(errors.message)"
            :class="[panelInput, 'resize-y leading-[1.6]']"
          />
          <p v-if="errors.message" class="field-error">{{ errors.message }}</p>
        </div>
      </template>

      <template v-else>
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="contact-name" class="field-label">Naam</label>
            <input
              id="contact-name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              class="field-input"
              :aria-invalid="Boolean(errors.name)"
            >
            <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
          </div>

          <div>
            <label for="contact-email" class="field-label">E-mailadres</label>
            <input
              id="contact-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              class="field-input"
              :aria-invalid="Boolean(errors.email)"
            >
            <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
          </div>
        </div>

        <div>
          <label for="contact-phone" class="field-label">
            Telefoonnummer <span class="font-normal text-slate-400">(optioneel)</span>
          </label>
          <input
            id="contact-phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            class="field-input"
          >
        </div>

        <div>
          <label for="contact-message" class="field-label">Bericht</label>
          <textarea
            id="contact-message"
            v-model="form.message"
            rows="5"
            class="field-input"
            :aria-invalid="Boolean(errors.message)"
          />
          <p v-if="errors.message" class="field-error">{{ errors.message }}</p>
        </div>
      </template>

      <div aria-hidden="true" class="absolute left-[-9999px]">
        <label for="contact-website">Laat dit veld leeg</label>
        <input id="contact-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" >
      </div>

      <template v-if="panel">
        <label class="mt-5 flex cursor-pointer items-start gap-2.5 text-[13px] leading-normal text-ink-700">
          <input
            v-model="form.privacy"
            type="checkbox"
            class="mt-px h-[15px] w-[15px] flex-none accent-accent-500"
            :aria-invalid="Boolean(errors.privacy)"
          >
          <span>{{ copy.privacy }}<span class="text-danger">{{ copy.privacyRequired }}</span></span>
        </label>
        <p v-if="errors.privacy" class="field-error">{{ errors.privacy }}</p>
      </template>

      <p v-if="status === 'error'" class="field-error" role="alert">{{ errorMessage }}</p>

      <button
        type="submit"
        class="btn-primary"
        :class="panel && 'mt-[18px] w-full py-[15px]'"
        :disabled="status === 'pending'"
      >
        <template v-if="panel">{{ status === 'pending' ? copy.submitting : copy.submit }}</template>
        <template v-else>{{ status === 'pending' ? 'Versturen…' : 'Verstuur bericht' }}</template>
      </button>
    </form>
  </div>
</template>
