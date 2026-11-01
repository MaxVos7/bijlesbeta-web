<script setup lang="ts">
import { mijnReset as copy } from '~/data/mijn'

/*
  The page a mailed password link opens: the welcome mail after the aanmelding
  ("Maak wachtwoord aan") and "wachtwoord vergeten" both end here. The token and
  address come from the link; `POST api/web/password/reset` checks them.
*/
definePageMeta({ layout: 'mijn', middleware: 'mijn-guest' })
useHead({ title: copy.title })

const route = useRoute()
const token = typeof route.query.token === 'string' ? route.query.token : ''
const email = typeof route.query.email === 'string' ? route.query.email : ''

const form = reactive({ password: '', password_confirmation: '' })
const pending = ref(false)
const errors = ref<Record<string, string>>({})
const errorMessage = ref('')

async function onSubmit() {
  errors.value = {}
  errorMessage.value = ''

  if (form.password !== form.password_confirmation) {
    errors.value = { password_confirmation: copy.mismatch }
    return
  }

  pending.value = true

  try {
    await $fetch('/api/mijn/password/reset', { method: 'POST', body: { token, email, ...form } })
    await navigateTo({ path: '/mijn/inloggen/', query: { wachtwoord: 'ingesteld' } })
  }
  catch (error: any) {
    const fieldErrors: Record<string, string[]> = error?.data?.errors ?? {}

    if (Object.keys(fieldErrors).length) {
      errors.value = Object.fromEntries(Object.entries(fieldErrors).map(([field, messages]) => [field, messages[0] ?? '']))
    }
    else {
      errorMessage.value = mijnErrorMessage(error)
    }
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="container-page">
    <div class="panel mx-auto mt-6 max-w-[480px] p-6 sm:p-9">
      <p class="kicker">{{ copy.kicker }}</p>
      <h1 class="mt-3 text-[32px] leading-[44px]">{{ copy.title }}</h1>

      <template v-if="!token || !email">
        <p class="mt-2 text-[14px] leading-[21px] text-ink-700">{{ copy.invalidLink }}</p>
        <NuxtLink to="/mijn/wachtwoord-vergeten/" class="btn-primary mt-6 inline-block">{{ copy.newLink }}</NuxtLink>
      </template>

      <template v-else>
        <p class="mt-2 text-[14px] leading-[21px] text-ink-700">{{ copy.intro }}</p>
        <p class="mt-4 text-[14px] text-ink-800"><span class="font-semibold">{{ copy.email }}:</span> {{ email }}</p>

        <form class="mt-6 flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
          <div>
            <label for="mijn-reset-password" class="field-label">{{ copy.new }}</label>
            <input
              id="mijn-reset-password"
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              required
              class="field-input"
              :aria-invalid="!!errors.password"
            >
            <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
            <p v-else class="field-hint mt-1.5">{{ copy.hint }}</p>
          </div>

          <div>
            <label for="mijn-reset-confirm" class="field-label">{{ copy.confirm }}</label>
            <input
              id="mijn-reset-confirm"
              v-model="form.password_confirmation"
              type="password"
              autocomplete="new-password"
              required
              class="field-input"
              :aria-invalid="!!errors.password_confirmation"
            >
            <p v-if="errors.password_confirmation" class="field-error">{{ errors.password_confirmation }}</p>
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="pending">
            {{ pending ? copy.pending : copy.submit }}
          </button>

          <p v-if="errors.email || errorMessage" class="field-error mt-0" role="alert">
            {{ errors.email || errorMessage }}
          </p>
          <NuxtLink v-if="errors.email" to="/mijn/wachtwoord-vergeten/" class="text-[14px] font-semibold text-ink-800 underline">
            {{ copy.newLink }}
          </NuxtLink>
        </form>
      </template>
    </div>
  </div>
</template>
