<script setup lang="ts">
import { werkenBij } from '~/data/site'

/*
  The docent application form from /werken-bij.

  There is no sollicitatie endpoint yet, so the answers are composed into a
  single message and posted to /api/contact with a fixed subject — the same
  path ContactForm takes. The CV dropzone is deliberately visual only: the
  contact endpoint accepts JSON, not multipart, so only the file *name* travels
  along in the message and the team asks for the document by mail.
*/

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  subjects: [] as string[],
  study: '',
  motivation: '',
  postalCode: '',
  houseNumber: '',
  heardFrom: '',
  privacy: false,
  // Honeypot — bots fill this, humans never see it.
  website: '',
})

const fileInput = ref<HTMLInputElement | null>(null)
const cvFileName = ref('')

const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const errors = ref<Record<string, string>>({})
const errorMessage = ref('')

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  cvFileName.value = file?.name ?? ''
}

function validate() {
  const next: Record<string, string> = {}
  if (!form.firstName.trim()) next.firstName = 'Vul je voornaam in.'
  if (!form.lastName.trim()) next.lastName = 'Vul je achternaam in.'
  if (!form.phone.trim()) next.phone = 'Vul je telefoonnummer in.'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = 'Vul een geldig e-mailadres in.'
  if (form.subjects.length === 0) next.subjects = 'Kies minimaal één vak.'
  if (!form.study.trim()) next.study = 'Vul je studie in.'
  if (form.motivation.trim().length < 10) {
    next.motivation = 'Vertel ons iets meer (minimaal 10 tekens).'
  }
  if (!form.postalCode.trim()) next.postalCode = 'Vul je postcode in.'
  if (!form.houseNumber.trim()) next.houseNumber = 'Vul je huisnummer in.'
  if (!form.privacy) next.privacy = 'Ga akkoord met het privacybeleid om te versturen.'
  errors.value = next
  return Object.keys(next).length === 0
}

/** Everything the contact endpoint has no field for goes into the message body. */
function composeMessage() {
  const lines = [
    `Bijlesvakken: ${form.subjects.join(', ')}`,
    `Studie: ${form.study.trim()}`,
    `Adres: ${form.postalCode.trim()} ${form.houseNumber.trim()}`,
  ]
  if (form.heardFrom.trim()) lines.push(`Kent ons van: ${form.heardFrom.trim()}`)
  if (cvFileName.value) lines.push(`CV: ${cvFileName.value} (niet meegestuurd — per mail opvragen)`)
  lines.push('', 'Motivatie:', form.motivation.trim())
  return lines.join('\n')
}

async function submit() {
  if (status.value === 'pending' || !validate()) return

  status.value = 'pending'
  errorMessage.value = ''

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: 'Sollicitatie docent',
        message: composeMessage(),
        website: form.website,
      },
    })
    status.value = 'success'
  }
  catch (error: any) {
    status.value = 'error'
    errorMessage.value
      = error?.data?.message
        ?? 'Er ging iets mis bij het versturen. Probeer het later opnieuw of mail ons.'
  }
}
</script>

<template>
  <!--
    The live panel is a flat 8px white surface with 24px of padding and no
    elevation, so `panel`'s shadow is switched off here rather than removed
    from the utility, which other pages still want.
  -->
  <div class="panel min-w-0 self-start p-6 shadow-none">
    <div class="mb-[26px] text-center">
      <p class="mb-1 font-display text-[15px] font-bold text-accent-500">
        {{ werkenBij.apply.formKicker }}
      </p>
      <h3 class="text-[22px] leading-[44px] tracking-[-0.02em]">{{ werkenBij.apply.formTitle }}</h3>
    </div>

    <div
      v-if="status === 'success'"
      class="rounded-field border border-success-500 bg-success-50 p-6"
      role="status"
    >
      <h3 class="text-lg text-success-900">Bedankt voor je sollicitatie</h3>
      <p class="mt-2 text-sm leading-relaxed text-success-900">
        We hebben je gegevens ontvangen en nemen contact op voor het inplannen van een
        sollicitatiegesprek.
      </p>
    </div>

    <form v-else class="flex flex-col gap-5" novalidate @submit.prevent="submit">
      <div>
        <span class="field-label mb-0">
          Naam <span class="text-brand-700">(Vereist)</span>
        </span>
        <div class="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
          <div>
            <input
              id="sollicitatie-voornaam"
              v-model="form.firstName"
              type="text"
              placeholder="Voornaam"
              autocomplete="given-name"
              class="field-input-lg"
              :aria-invalid="Boolean(errors.firstName)"
            >
            <label for="sollicitatie-voornaam" class="mt-1.5 block text-[12.5px] text-ink-500">
              Voornaam
            </label>
            <p v-if="errors.firstName" class="field-error">{{ errors.firstName }}</p>
          </div>
          <div>
            <input
              id="sollicitatie-achternaam"
              v-model="form.lastName"
              type="text"
              placeholder="Achternaam"
              autocomplete="family-name"
              class="field-input-lg"
              :aria-invalid="Boolean(errors.lastName)"
            >
            <label for="sollicitatie-achternaam" class="mt-1.5 block text-[12.5px] text-ink-500">
              Achternaam
            </label>
            <p v-if="errors.lastName" class="field-error">{{ errors.lastName }}</p>
          </div>
        </div>
      </div>

      <div>
        <label for="sollicitatie-telefoon" class="field-label mb-0">
          Telefoon <span class="text-brand-700">(Vereist)</span>
        </label>
        <input
          id="sollicitatie-telefoon"
          v-model="form.phone"
          type="tel"
          placeholder="Telefoonnummer"
          autocomplete="tel"
          class="field-input-lg"
          :aria-invalid="Boolean(errors.phone)"
        >
        <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
      </div>

      <div>
        <label for="sollicitatie-email" class="field-label mb-0">
          E-mailadres <span class="text-brand-700">(Vereist)</span>
        </label>
        <input
          id="sollicitatie-email"
          v-model="form.email"
          type="email"
          placeholder="E-mailadres"
          autocomplete="email"
          class="field-input-lg"
          :aria-invalid="Boolean(errors.email)"
        >
        <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
      </div>

      <fieldset>
        <legend class="field-label mb-2.5">
          Bijlesvakken <span class="text-brand-700">(Vereist)</span>
        </legend>
        <div
          class="grid gap-x-[18px] gap-y-2.5 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]"
        >
          <label
            v-for="option in werkenBij.subjectOptions"
            :key="option"
            class="flex items-center gap-2.5 text-[13.5px]"
          >
            <input
              v-model="form.subjects"
              type="checkbox"
              :value="option"
              class="h-5 w-5 flex-none accent-accent-500"
            >
            {{ option }}
          </label>
        </div>
        <p v-if="errors.subjects" class="field-error">{{ errors.subjects }}</p>
      </fieldset>

      <div>
        <label for="sollicitatie-studie" class="field-label mb-0">
          Mijn studie <span class="text-brand-700">(Vereist)</span>
        </label>
        <input
          id="sollicitatie-studie"
          v-model="form.study"
          type="text"
          placeholder="Mijn studie"
          class="field-input-lg"
          :aria-invalid="Boolean(errors.study)"
        >
        <p v-if="errors.study" class="field-error">{{ errors.study }}</p>
      </div>

      <div>
        <label for="sollicitatie-motivatie" class="field-label mb-0">
          Mijn motivatie <span class="text-brand-700">(Vereist)</span>
        </label>
        <textarea
          id="sollicitatie-motivatie"
          v-model="form.motivation"
          rows="6"
          placeholder="Mijn motivatie"
          class="field-input-lg resize-y py-0"
          :aria-invalid="Boolean(errors.motivation)"
        />
        <p v-if="errors.motivation" class="field-error">{{ errors.motivation }}</p>
      </div>

      <div>
        <span class="field-label mb-2">
          CV uploaden <span class="text-brand-700">(Vereist)</span>
        </span>
        <div
          class="flex flex-col items-center justify-center gap-3 rounded-field border border-dashed border-ink-300 bg-white px-5 py-[34px]"
        >
          <svg
            class="h-[30px] w-[30px] text-brand-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M16.5 18H18a3.5 3.5 0 000-7 5 5 0 00-9.6-1.4A4 4 0 006.5 18H8" />
            <path d="M12 21V11M8.5 14.5L12 11l3.5 3.5" />
          </svg>
          <p class="text-[13.5px] text-ink-600">
            {{ cvFileName || 'Sleep bestanden hierheen of' }}
          </p>
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.doc,.docx"
            class="sr-only"
            @change="onFileChange"
          >
          <button type="button" class="btn-primary text-[13.5px]" @click="fileInput?.click()">
            Selecteer bestanden
          </button>
        </div>
        <p class="mt-2.5 text-[12.5px] text-ink-500">Max. bestandsgrootte: 2 MB.</p>
      </div>

      <div class="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
        <div>
          <label for="sollicitatie-postcode" class="field-label mb-0">
            Postcode <span class="text-brand-700">(Vereist)</span>
          </label>
          <input
            id="sollicitatie-postcode"
            v-model="form.postalCode"
            type="text"
            placeholder="1234AB"
            autocomplete="postal-code"
            class="field-input-lg"
            :aria-invalid="Boolean(errors.postalCode)"
          >
          <p v-if="errors.postalCode" class="field-error">{{ errors.postalCode }}</p>
        </div>
        <div>
          <label for="sollicitatie-huisnummer" class="field-label mb-0">
            Huisnummer <span class="text-brand-700">(Vereist)</span>
          </label>
          <input
            id="sollicitatie-huisnummer"
            v-model="form.houseNumber"
            type="text"
            placeholder="1A"
            class="field-input-lg"
            :aria-invalid="Boolean(errors.houseNumber)"
          >
          <p v-if="errors.houseNumber" class="field-error">{{ errors.houseNumber }}</p>
        </div>
      </div>

      <div>
        <label for="sollicitatie-bron" class="field-label mb-0">Ik ken jullie van</label>
        <input
          id="sollicitatie-bron"
          v-model="form.heardFrom"
          type="text"
          placeholder="Ik ken jullie van"
          class="field-input-lg"
        >
      </div>

      <div aria-hidden="true" class="absolute left-[-9999px]">
        <label for="sollicitatie-website">Laat dit veld leeg</label>
        <input
          id="sollicitatie-website"
          v-model="form.website"
          type="text"
          tabindex="-1"
          autocomplete="off"
        >
      </div>

      <div>
        <label class="mt-3.5 flex items-start gap-3 text-[13.5px] leading-normal">
          <input
            v-model="form.privacy"
            type="checkbox"
            class="mt-0.5 h-5 w-5 flex-none accent-accent-500"
            :aria-invalid="Boolean(errors.privacy)"
          >
          <span>
            Ik ga akkoord met het
            <NuxtLink to="/privacy" class="underline">privacybeleid</NuxtLink>.<span
              class="text-brand-700"
            >(Vereist)</span>
          </span>
        </label>
        <p v-if="errors.privacy" class="field-error">{{ errors.privacy }}</p>
      </div>

      <p v-if="status === 'error'" class="field-error" role="alert">{{ errorMessage }}</p>

      <button type="submit" class="btn-primary w-full py-4 hover:bg-ink-900 hover:text-white" :disabled="status === 'pending'">
        {{ status === 'pending' ? 'Versturen…' : 'Aanmelden' }}
      </button>
    </form>
  </div>
</template>
