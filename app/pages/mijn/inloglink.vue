<script setup lang="ts">
import { mijnMagicLink } from '~/data/mijn'

definePageMeta({ layout: 'mijn', middleware: 'mijn-guest' })
useHead({ title: mijnMagicLink.title })
</script>

<template>
  <MijnEmailRequest endpoint="/api/mijn/magic-link" :copy="mijnMagicLink" />
</template>
