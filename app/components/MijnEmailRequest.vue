<script setup lang="ts">
/*
  One field, one button: "mail me a link". Used by the forgotten-password page
  and the login-link page. The portal answers the same for an unknown address,
  so the confirmation here never says whether the address has an account.
*/
const props = defineProps<{
  endpoint: string
  copy: { kicker: string, title: string, intro: string, email: string, submit: string, pending: string, back: string }
}>()

const email = ref('')
const pending = ref(false)
const done = ref('')
const errorMessage = ref('')

async function onSubmit() {
  pending.value = true
  done.value = ''
  errorMessage.value = ''

  try {
    const result = await $fetch<{ message: string }>(props.endpoint, { method: 'POST', body: { email: email.value } })
    done.value = result.message
  }
  catch (error: any) {
    errorMessage.value = (error?.statusCode ?? error?.status) === 429
      ? 'Te veel pogingen. Wacht een minuut en probeer het opnieuw.'
      : mijnErrorMessage(error)
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="container-page">
    <div class="panel mx-auto mt-6 max-w-[440px] p-6 sm:p-9">
      <p class="kicker">{{ copy.kicker }}</p>
      <h1 class="mt-3 text-[32px] leading-[44px]">{{ copy.title }}</h1>
      <p class="mt-2 text-[14px] leading-[21px] text-ink-700">{{ copy.intro }}</p>

      <p v-if="done" class="mt-5 rounded-card bg-success-50 p-4 text-[15px] text-success-900" role="status">{{ done }}</p>

      <form v-else class="mt-6 flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
        <div>
          <label for="mijn-request-email" class="field-label">{{ copy.email }}</label>
          <input
            id="mijn-request-email"
            v-model="email"
            type="email"
            autocomplete="username"
            required
            class="field-input"
          >
        </div>

        <button type="submit" class="btn-primary w-full" :disabled="pending">
          {{ pending ? copy.pending : copy.submit }}
        </button>

        <p v-if="errorMessage" class="field-error mt-0" role="alert">{{ errorMessage }}</p>
      </form>

      <NuxtLink to="/mijn/inloggen/" class="mt-6 inline-block text-[14px] font-semibold text-ink-800 underline">
        {{ copy.back }}
      </NuxtLink>
    </div>
  </div>
</template>
