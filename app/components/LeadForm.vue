<script setup lang="ts">
/**
 * The short callback form: name, phone, email, consent.
 *
 * Used twice on a landing page — once in the hero, once in TrialCta — so the
 * field ids are namespaced with `useId()` rather than hard-coded.
 *
 * It collects only three fields, so it synthesises the message body that
 * /api/contact requires: the request itself is the message.
 */
const props = withDefaults(
  defineProps<{
    /** Sent to /api/contact so we can tell the landing hero from the closing block. */
    source?: string
  }>(),
  { source: 'Aanvraag voor een gratis proefles via de website.' },
)

const uid = useId()

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
    const result = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: 'Gratis proefles',
        message: props.source,
        website: form.website,
      },
    })

    // 200 with `ok: false` when it reached nobody — see `deliveryResult`.
    if (result.ok === false) {
      status.value = 'error'
      message.value = result.message
      return
    }

    status.value = 'success'
  } catch (error: any) {
    status.value = 'error'
    message.value =
      error?.data?.data?.message ??
      'Er ging iets mis bij het versturen. Probeer het later opnieuw of bel ons.'
  }
}
</script>

<template>
  <div>
    <div v-if="status === 'success'" class="py-6 text-center" role="status">
      <h3 class="text-[17px]">Bedankt voor je bericht!</h3>
      <p class="mt-2 text-[15px] leading-relaxed text-ink-700">
        We nemen snel contact met je op om de proefles in te plannen.
      </p>
    </div>

    <form v-else class="flex flex-col gap-3.5" novalidate @submit.prevent="submit">
      <label class="sr-only" :for="`${uid}-name`">Naam</label>
      <input :id="`${uid}-name`" v-model="form.name" class="field-input mt-0" type="text" placeholder="Naam" autocomplete="name">

      <label class="sr-only" :for="`${uid}-phone`">Telefoonnummer</label>
      <input :id="`${uid}-phone`" v-model="form.phone" class="field-input mt-0" type="tel" placeholder="Telefoonnummer" autocomplete="tel">

      <label class="sr-only" :for="`${uid}-email`">E-mailadres</label>
      <input :id="`${uid}-email`" v-model="form.email" class="field-input mt-0" type="email" placeholder="E-mailadres" autocomplete="email">

      <label class="group flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-normal text-ink-700">
        <input v-model="form.consent" class="sr-only" type="checkbox">
        <span
          class="mt-px flex h-[18px] w-[18px] flex-none items-center justify-center rounded border-[1.5px] border-field-line bg-white transition group-has-[:checked]:border-accent-500 group-has-[:checked]:bg-accent-400 group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-accent-500"
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
        <!-- "privacybeleid" is set plain here, not as a link, matching the live
             form. The linked version still stands in the longer SignupForm. -->
        <span>Ik ga akkoord met het privacybeleid.<span class="text-danger">(Vereist)</span></span>
      </label>

      <div aria-hidden="true" class="absolute left-[-9999px]">
        <label :for="`${uid}-website`">Laat dit veld leeg</label>
        <input :id="`${uid}-website`" v-model="form.website" type="text" tabindex="-1" autocomplete="off">
      </div>

      <p v-if="status === 'error'" class="text-[12.5px] text-danger" role="alert">{{ message }}</p>

      <button
        type="submit"
        class="btn-primary w-full py-[17px] leading-[15px]"
        :disabled="status === 'pending'"
      >
        {{ status === 'pending' ? 'Versturen…' : 'Proefles claimen' }}
      </button>
    </form>
  </div>
</template>
