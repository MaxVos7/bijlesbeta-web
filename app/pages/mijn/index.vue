<script setup lang="ts">
import { mijnChangePassword, mijnHome } from '~/data/mijn'

definePageMeta({ layout: 'mijn', middleware: 'mijn' })
useHead({ title: mijnHome.title })

const config = useRuntimeConfig()
const { user } = useMijnSession()
</script>

<template>
  <div class="container-page">
    <div v-if="user" class="panel p-6 sm:p-9">
      <template v-if="user.must_change_password">
        <h1 class="text-[28px] leading-[38px]">{{ mijnChangePassword.title }}</h1>
        <p class="mt-3 text-[15px] leading-relaxed text-ink-700">{{ mijnChangePassword.body }}</p>
        <a :href="`${config.public.portalUrl}/login`" class="btn-primary mt-6">
          {{ mijnChangePassword.cta }}
        </a>
      </template>

      <template v-else>
        <h1 class="text-[32px] leading-[44px]">{{ mijnHome.greeting(user.name) }}</h1>
        <p class="mt-3 text-[15px] leading-relaxed text-ink-700">{{ mijnHome.intro }}</p>
      </template>
    </div>
  </div>
</template>
