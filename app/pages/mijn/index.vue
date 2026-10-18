<script setup lang="ts">
/*
  Not a page of its own: customers open on their overview, tutors on their
  lessons, as in the app. (An account that must change its password never
  gets here — the `mijn` middleware sends it to the password form first.)
*/
definePageMeta({
  layout: 'mijn',
  middleware: [
    'mijn',
    () => {
      const { user } = useMijnSession()
      return navigateTo(user.value?.is_customer ? '/mijn/overzicht/' : '/mijn/lessen/', { replace: true })
    },
  ],
})
</script>

<template>
  <div />
</template>
