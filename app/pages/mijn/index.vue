<script setup lang="ts">
import { mijnChangePassword } from '~/data/mijn'

/*
  No overview of its own yet: like the app, `/mijn/` opens on the lessons.
  The one exception is an account still on its invitation password, which has
  to set its own on the portal first — there is no API route for that yet.
*/
definePageMeta({
  layout: 'mijn',
  middleware: [
    'mijn',
    () => {
      const { user } = useMijnSession()
      if (user.value && !user.value.must_change_password) {
        return navigateTo('/mijn/lessen/', { replace: true })
      }
    },
  ],
})
useHead({ title: mijnChangePassword.title })

const config = useRuntimeConfig()
</script>

<template>
  <div class="container-page">
    <div class="panel p-6 sm:p-9">
      <h1 class="text-[28px] leading-[38px]">{{ mijnChangePassword.title }}</h1>
      <p class="mt-3 text-[15px] leading-relaxed text-ink-700">{{ mijnChangePassword.body }}</p>
      <a :href="`${config.public.portalUrl}/login`" class="btn-primary mt-6">
        {{ mijnChangePassword.cta }}
      </a>
    </div>
  </div>
</template>
