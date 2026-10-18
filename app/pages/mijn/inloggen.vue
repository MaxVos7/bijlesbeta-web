<script setup lang="ts">
import { mijnLogin } from '~/data/mijn'

definePageMeta({ layout: 'mijn', middleware: 'mijn-guest' })
useHead({ title: mijnLogin.title })

const config = useRuntimeConfig()
const route = useRoute()
const { login } = useMijnSession()

const form = reactive({ email: '', password: '' })
const pending = ref(false)
const errors = ref<Record<string, string>>({})
const errorMessage = ref('')

/** Only back into `/mijn/` — a `redirect` pointing anywhere else is ignored. */
function target() {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/mijn/') ? redirect : '/mijn/'
}

async function onSubmit() {
  pending.value = true
  errors.value = {}
  errorMessage.value = ''

  try {
    await login(form.email, form.password)
    await navigateTo(target())
  }
  catch (error: any) {
    const status = error?.statusCode ?? error?.status
    const fieldErrors: Record<string, string[]> = error?.data?.errors ?? {}

    form.password = ''

    if (status === 422 && Object.keys(fieldErrors).length) {
      errors.value = Object.fromEntries(
        Object.entries(fieldErrors).map(([field, messages]) => [field, messages[0] ?? '']),
      )
    }
    else if (status === 429) {
      errorMessage.value = mijnLogin.throttled
    }
    else {
      errorMessage.value = error?.data?.message ?? mijnLogin.failed
    }
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="container-page">
    <div class="panel mx-auto mt-6 max-w-[440px] p-6 sm:p-9">
      <p class="kicker">{{ mijnLogin.kicker }}</p>
      <h1 class="mt-3 text-[32px] leading-[44px]">{{ mijnLogin.title }}</h1>
      <p class="mt-2 text-[14px] leading-[21px] text-ink-700">{{ mijnLogin.intro }}</p>

      <form class="mt-6 flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
        <div>
          <label for="mijn-email" class="field-label">{{ mijnLogin.email }}</label>
          <input
            id="mijn-email"
            v-model="form.email"
            type="email"
            autocomplete="username"
            required
            class="field-input"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'mijn-email-error' : undefined"
          >
          <p v-if="errors.email" id="mijn-email-error" class="field-error">{{ errors.email }}</p>
        </div>

        <div>
          <label for="mijn-password" class="field-label">{{ mijnLogin.password }}</label>
          <input
            id="mijn-password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            required
            class="field-input"
            :aria-invalid="!!errors.password"
            :aria-describedby="errors.password ? 'mijn-password-error' : undefined"
          >
          <p v-if="errors.password" id="mijn-password-error" class="field-error">{{ errors.password }}</p>
        </div>

        <button type="submit" class="btn-primary w-full" :disabled="pending">
          {{ pending ? mijnLogin.pending : mijnLogin.submit }}
        </button>

        <p v-if="errorMessage" class="field-error mt-0" role="alert">{{ errorMessage }}</p>

        <a
          :href="`${config.public.portalUrl}/forgot-password`"
          class="text-[14px] font-semibold text-ink-800 underline"
        >
          {{ mijnLogin.forgotPassword }}
        </a>
      </form>
    </div>
  </div>
</template>
