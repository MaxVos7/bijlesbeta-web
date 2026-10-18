<script setup lang="ts">
import { mijnNav } from '~/data/mijn'

/*
  The logged-in shell: the site's white header card, but with the account's
  own links instead of the marketing nav, and no footer. Links appear here as
  their pages are ported from the app.
*/
const { user, logout } = useMijnSession()
const pending = ref(false)

const nav = computed(() => (user.value ? [{ to: '/mijn/', label: mijnNav.home }] : []))

async function onLogout() {
  pending.value = true
  try {
    await logout()
  }
  finally {
    pending.value = false
    await navigateTo('/mijn/inloggen/')
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <div class="px-5 pt-4 pb-4 md:px-10 md:pt-10 md:pb-6">
      <header
        class="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-4 rounded-[12px] bg-white px-6 py-4 shadow-panel"
      >
        <NuxtLink to="/" class="block flex-none" aria-label="Bijles Bèta — naar de homepage">
          <img
            src="/logo.svg"
            alt="Bijles Bèta"
            class="block h-[28px] w-[71px] object-cover object-center md:h-[35px] md:w-[95px]"
            width="142"
            height="56"
          >
        </NuxtLink>

        <nav v-if="user" class="flex flex-1 flex-wrap items-center gap-x-6" aria-label="Mijn Bijles Bèta">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="font-display text-[15px] font-bold text-ink-900 transition-colors duration-300 hover:text-brand-500"
            exact-active-class="text-brand-500"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <button
          v-if="user"
          type="button"
          class="btn-secondary"
          :disabled="pending"
          @click="onLogout"
        >
          {{ mijnNav.logout }}
        </button>
      </header>
    </div>

    <!--
      `data-ph-mask` masks every text node below it in PostHog session replay
      (inputs are masked sitewide already). These pages show students' names
      and lesson details, none of which belongs in a recording.
    -->
    <main class="flex-1 pb-16" data-ph-mask>
      <slot />
    </main>
  </div>
</template>
