<script setup lang="ts">
import { mijnPassword as copy } from '~/data/mijn'

/*
  Changing the password, through `POST api/account/password`. For an account
  still on its invitation password (`must_change_password`) this is the only
  page the `mijn` middleware lets through, and the current password isn't
  asked for — the same rule as the portal's PasswordController.
*/
definePageMeta({ layout: 'mijn', middleware: 'mijn' })

const api = useMijnApi()
const { user } = useMijnSession()

const forced = computed(() => !!user.value?.must_change_password)
useHead({ title: () => (forced.value ? copy.forcedTitle : copy.title) })

const form = reactive({ current_password: '', password: '', password_confirmation: '' })
const pending = ref(false)
const errors = ref<Record<string, string>>({})
const errorMessage = ref('')
const done = ref('')

async function onSubmit() {
  errors.value = {}
  errorMessage.value = ''
  done.value = ''

  if (form.password !== form.password_confirmation) {
    errors.value = { password_confirmation: copy.mismatch }
    return
  }

  pending.value = true

  try {
    const result = await api<{ message: string }>('account/password', {
      method: 'POST',
      body: forced.value
        ? { password: form.password, password_confirmation: form.password_confirmation }
        : form,
    })

    const wasForced = forced.value
    if (user.value) user.value.must_change_password = false

    // A forced change was what stood between the account and the rest of /mijn/.
    if (wasForced) return navigateTo('/mijn/', { replace: true })

    done.value = result.message
    form.current_password = form.password = form.password_confirmation = ''
  }
  catch (e: any) {
    const fieldErrors: Record<string, string[]> = e?.data?.errors ?? {}

    if (Object.keys(fieldErrors).length) {
      errors.value = Object.fromEntries(Object.entries(fieldErrors).map(([field, messages]) => [field, messages[0] ?? '']))
    }
    else {
      errorMessage.value = mijnErrorMessage(e)
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
      <h1 class="text-[28px] leading-[38px]">{{ forced ? copy.forcedTitle : copy.title }}</h1>
      <p v-if="forced" class="mt-2 text-[14px] leading-[21px] text-ink-700">{{ copy.forcedIntro }}</p>

      <p v-if="done" class="mt-5 rounded-card bg-success-50 p-4 text-[15px] text-success-900" role="status">{{ done }}</p>

      <form class="mt-6 flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
        <div v-if="!forced">
          <label for="mijn-current-password" class="field-label">{{ copy.current }}</label>
          <input
            id="mijn-current-password"
            v-model="form.current_password"
            type="password"
            autocomplete="current-password"
            required
            class="field-input"
            :aria-invalid="!!errors.current_password"
          >
          <p v-if="errors.current_password" class="field-error">{{ errors.current_password }}</p>
        </div>

        <div>
          <label for="mijn-new-password" class="field-label">{{ copy.new }}</label>
          <input
            id="mijn-new-password"
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
          <label for="mijn-confirm-password" class="field-label">{{ copy.confirm }}</label>
          <input
            id="mijn-confirm-password"
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

        <p v-if="errorMessage" class="field-error mt-0" role="alert">{{ errorMessage }}</p>

        <NuxtLink v-if="!forced" to="/mijn/profiel/" class="text-[14px] font-semibold text-ink-800 underline">
          {{ copy.back }}
        </NuxtLink>
      </form>
    </div>
  </div>
</template>
