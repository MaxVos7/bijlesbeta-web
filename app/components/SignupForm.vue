<script setup lang="ts">
import { subjects } from '~/data/site'

const levels = ['VMBO', 'HAVO', 'VWO', 'MBO', 'HBO / WO', 'Anders']
const lessonTypes = [
  { value: 'thuis', label: 'Bij mij thuis' },
  { value: 'online', label: 'Online' },
  { value: 'geen-voorkeur', label: 'Geen voorkeur' },
]

const form = reactive({
  studentName: '',
  contactName: '',
  email: '',
  phone: '',
  subjects: [] as string[],
  level: '',
  year: '',
  lessonType: 'geen-voorkeur',
  postalCode: '',
  notes: '',
  // Honeypot — bots fill this, humans never see it.
  website: '',
})

const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const errors = ref<Record<string, string>>({})
const errorMessage = ref('')

function validate() {
  const next: Record<string, string> = {}
  if (!form.studentName.trim()) next.studentName = 'Vul de naam van de leerling in.'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = 'Vul een geldig e-mailadres in.'
  if (!form.phone.trim()) next.phone = 'Vul een telefoonnummer in zodat we je kunnen bereiken.'
  if (form.subjects.length === 0) next.subjects = 'Kies minimaal één vak.'
  if (!form.level) next.level = 'Kies een niveau.'
  errors.value = next
  return Object.keys(next).length === 0
}

async function submit() {
  if (status.value === 'pending' || !validate()) return

  status.value = 'pending'
  errorMessage.value = ''

  try {
    await $fetch('/api/aanmelden', { method: 'POST', body: { ...form } })
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
  <div>
    <div
      v-if="status === 'success'"
      class="rounded-xl border border-green-200 bg-green-50 p-8"
      role="status"
    >
      <h2 class="text-xl text-green-900">Je aanmelding is binnen</h2>
      <p class="mt-3 leading-relaxed text-green-800">
        We gaan op zoek naar een docent die bij je past. Meestal hebben we binnen vijf dagen
        een match en nemen we contact op om de gratis proefles in te plannen.
      </p>
      <NuxtLink to="/" class="btn-secondary mt-6">Terug naar de homepage</NuxtLink>
    </div>

    <form v-else class="space-y-6" novalidate @submit.prevent="submit">
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="signup-student" class="field-label">Naam leerling</label>
          <input
            id="signup-student"
            v-model="form.studentName"
            type="text"
            class="field-input"
            :aria-invalid="Boolean(errors.studentName)"
          >
          <p v-if="errors.studentName" class="field-error">{{ errors.studentName }}</p>
        </div>

        <div>
          <label for="signup-contact" class="field-label">
            Naam ouder/verzorger <span class="font-normal text-slate-400">(optioneel)</span>
          </label>
          <input id="signup-contact" v-model="form.contactName" type="text" class="field-input" >
        </div>

        <div>
          <label for="signup-email" class="field-label">E-mailadres</label>
          <input
            id="signup-email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="field-input"
            :aria-invalid="Boolean(errors.email)"
          >
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>

        <div>
          <label for="signup-phone" class="field-label">Telefoonnummer</label>
          <input
            id="signup-phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            class="field-input"
            :aria-invalid="Boolean(errors.phone)"
          >
          <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
        </div>
      </div>

      <fieldset>
        <legend class="field-label">Voor welk vak zoek je bijles?</legend>
        <div class="flex flex-wrap gap-3">
          <label
            v-for="subject in subjects"
            :key="subject.slug"
            class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition has-checked:border-brand-600 has-checked:bg-brand-50"
          >
            <input
              v-model="form.subjects"
              type="checkbox"
              :value="subject.name"
              class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            >
            {{ subject.name }}
          </label>
        </div>
        <p v-if="errors.subjects" class="field-error">{{ errors.subjects }}</p>
      </fieldset>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="signup-level" class="field-label">Niveau</label>
          <select
            id="signup-level"
            v-model="form.level"
            class="field-input"
            :aria-invalid="Boolean(errors.level)"
          >
            <option value="" disabled>Kies een niveau</option>
            <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
          </select>
          <p v-if="errors.level" class="field-error">{{ errors.level }}</p>
        </div>

        <div>
          <label for="signup-year" class="field-label">
            Klas of studiejaar <span class="font-normal text-slate-400">(optioneel)</span>
          </label>
          <input id="signup-year" v-model="form.year" type="text" class="field-input" >
        </div>

        <div>
          <label for="signup-type" class="field-label">Waar wil je les?</label>
          <select id="signup-type" v-model="form.lessonType" class="field-input">
            <option v-for="type in lessonTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <div>
          <label for="signup-postal" class="field-label">
            Postcode <span class="font-normal text-slate-400">(optioneel)</span>
          </label>
          <input
            id="signup-postal"
            v-model="form.postalCode"
            type="text"
            autocomplete="postal-code"
            class="field-input"
          >
        </div>
      </div>

      <div>
        <label for="signup-notes" class="field-label">
          Waar loop je tegenaan? <span class="font-normal text-slate-400">(optioneel)</span>
        </label>
        <textarea
          id="signup-notes"
          v-model="form.notes"
          rows="4"
          class="field-input"
          placeholder="Bijvoorbeeld: welk onderwerp is lastig, wanneer is het volgende toetsmoment, of wanneer je beschikbaar bent."
        />
      </div>

      <div aria-hidden="true" class="absolute left-[-9999px]">
        <label for="signup-website">Laat dit veld leeg</label>
        <input id="signup-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" >
      </div>

      <p v-if="status === 'error'" class="field-error" role="alert">{{ errorMessage }}</p>

      <div class="flex flex-wrap items-center gap-4">
        <button type="submit" class="btn-primary" :disabled="status === 'pending'">
          {{ status === 'pending' ? 'Versturen…' : 'Aanmelden voor een gratis proefles' }}
        </button>
        <p class="text-sm text-slate-500">Vrijblijvend — je zit nergens aan vast.</p>
      </div>
    </form>
  </div>
</template>
