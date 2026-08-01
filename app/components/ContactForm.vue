<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Prefilled subject, e.g. "Sollicitatie docent". Sent along with the message. */
    subject?: string
  }>(),
  { subject: 'Algemene vraag' },
)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: '',
  // Honeypot — bots fill this, humans never see it.
  website: '',
})

const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const errors = ref<Record<string, string>>({})
const errorMessage = ref('')

function validate() {
  const next: Record<string, string> = {}
  if (!form.name.trim()) next.name = 'Vul je naam in.'
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
      body: { ...form, subject: props.subject },
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
  <div>
    <div
      v-if="status === 'success'"
      class="rounded-xl border border-green-200 bg-green-50 p-6"
      role="status"
    >
      <h3 class="text-lg text-green-900">Bedankt voor je bericht</h3>
      <p class="mt-2 text-green-800">
        We hebben je bericht ontvangen en nemen zo snel mogelijk contact met je op.
      </p>
    </div>

    <form v-else class="space-y-5" novalidate @submit.prevent="submit">
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

      <div aria-hidden="true" class="absolute left-[-9999px]">
        <label for="contact-website">Laat dit veld leeg</label>
        <input id="contact-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" >
      </div>

      <p v-if="status === 'error'" class="field-error" role="alert">{{ errorMessage }}</p>

      <button type="submit" class="btn-primary" :disabled="status === 'pending'">
        {{ status === 'pending' ? 'Versturen…' : 'Verstuur bericht' }}
      </button>
    </form>
  </div>
</template>
