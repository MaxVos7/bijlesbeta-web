<script setup lang="ts">
import { mijnOpen as copy } from '~/data/mijn'

/*
  Where a link from a mail or WhatsApp message lands. The portal checked the
  link and left a one-time code in the address's fragment (never sent to a
  server, so it stays out of logs); this trades it for a login and moves on to
  the page the link was for. `next` is only ever a `/mijn/` path.
*/
definePageMeta({ layout: 'mijn' })
useHead({ title: copy.title })

const route = useRoute()
const { refresh } = useMijnSession()
const failed = ref(false)

function safeNext() {
  const next = route.query.next
  return typeof next === 'string' && next.startsWith('/mijn/') && !next.startsWith('//') ? next : '/mijn/'
}

onMounted(async () => {
  const code = new URLSearchParams(window.location.hash.slice(1)).get('code') ?? ''

  // The code has done its job once it is read; keep it out of the history.
  window.history.replaceState(null, '', window.location.pathname + window.location.search)

  try {
    await $fetch('/api/mijn/exchange', { method: 'POST', body: { code } })
    // Asks who is logged in now, so the pages that follow start with the right account.
    await refresh()
    await navigateTo(safeNext(), { replace: true })
  }
  catch {
    failed.value = true
    await navigateTo({ path: '/mijn/inloggen/', query: { verlopen: '1', redirect: safeNext() } }, { replace: true })
  }
})
</script>

<template>
  <div class="container-page">
    <div class="panel mx-auto mt-6 max-w-[440px] p-6 sm:p-9">
      <h1 class="text-[28px] leading-[38px]">{{ copy.title }}</h1>
      <p class="mt-2 text-[14px] leading-[21px] text-ink-700" role="status">
        {{ failed ? copy.failed : copy.pending }}
      </p>
    </div>
  </div>
</template>
