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
  The panel's fields are the live Gravity Forms controls, measured off
  bijlesbeta.nl/contact: a 42px box with 20px of horizontal padding, 15px/600
  Plus Jakarta Sans on a 44px leading and no vertical padding — the leading is
  what centres the value in a box shorter than its own line. The rule is the
  form plugin's `#0000001A`, not the site's warm `line-*` ramp.

  They are placeholder-only, so `field-input`'s label margin is cleared.
*/
const panelInput =
  'field-input mt-0 h-[42px] border-black/10 py-0 font-display leading-[44px]'

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
    const result = await $fetch('/api/contact', {
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

    /*
      A submission that reached nobody answers 200 with `ok: false` rather than
      a 502, because Cloudflare replaces an origin 502 with its own page and
      the message telling the visitor to call never arrives. See
      `deliveryResult`.
    */
    if (result.ok === false) {
      status.value = 'error'
      errorMessage.value = result.message
      return
    }

    status.value = 'success'
  } catch (error: any) {
    status.value = 'error'
    errorMessage.value =
      error?.data?.data?.message ??
      'Er ging iets mis bij het versturen. Probeer het later opnieuw of bel ons.'
  }
}
</script>

<template>
  <!-- The live panel is a flat white 8px card on 24px of padding — no shadow. -->
  <div :class="panel && 'rounded-panel bg-white p-6'">
    <div v-if="status === 'success' && panel" role="status">
      <p class="kicker text-center text-[15px] leading-[15px]">{{ copy.kicker }}</p>
      <h2 class="mt-3 text-center text-[22px] leading-[44px]">
        {{ contactFormSuccess.title }}
      </h2>
      <p class="text-center text-[14px] leading-[21px] text-ink-700">
        {{ contactFormSuccess.body }}
      </p>
    </div>

    <div
      v-else-if="status === 'success'"
      class="rounded-panel border border-success-500/30 bg-success-50 p-6"
      role="status"
    >
      <h3 class="text-lg text-success-900">{{ contactFormSuccess.title }}</h3>
      <p class="mt-2 text-ink-800">{{ contactFormSuccess.body }}</p>
    </div>

    <form v-else :class="!panel && 'space-y-5'" novalidate @submit.prevent="submit">
      <template v-if="panel">
        <!--
          15px kicker and a 22px title on the 44px leading, both centred. The
          12px between them and above the fields is the panel container's own
          gap on the live page; the extra 4px under the title is the heading
          widget's margin.
        -->
        <p class="kicker mb-3 text-center text-[15px] leading-[15px]">{{ copy.kicker }}</p>
        <h2 class="mb-4 text-center text-[22px] leading-[44px]">
          {{ copy.title }}
        </h2>

        <!-- The live name field splits into two inputs on a 12px gutter. -->
        <div class="flex gap-3">
          <div class="flex-1">
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

          <div class="flex-1">
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

        <div class="mt-2">
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

        <!-- The live message box is a flat 192px, not a row count. -->
        <div class="mt-2">
          <textarea
            v-model="form.message"
            :placeholder="copy.message"
            :aria-label="copy.message"
            :aria-invalid="Boolean(errors.message)"
            :class="[panelInput, 'h-[192px] resize-y']"
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
        <!--
          The live consent row is a 20px box on a 4px radius beside 14px/20px
          copy. Gravity Forms sets that label in its own cool `#112337`; the
          site's ink is kept instead, which is the same call `main.css` makes
          everywhere but the placeholder grey.
        -->
        <label class="mt-2 flex cursor-pointer items-start gap-2.5 font-display text-[14px] leading-[20px]">
          <input
            v-model="form.privacy"
            type="checkbox"
            class="h-5 w-5 flex-none rounded-field accent-accent-500"
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
        :class="panel && 'mt-4 w-full px-4 py-[17px] leading-[15px]'"
        :disabled="status === 'pending'"
      >
        <template v-if="panel">{{ status === 'pending' ? copy.submitting : copy.submit }}</template>
        <template v-else>{{ status === 'pending' ? 'Versturen…' : 'Verstuur bericht' }}</template>
      </button>
    </form>
  </div>
</template>
