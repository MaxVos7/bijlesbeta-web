<script setup lang="ts">
import { mijnForgot } from '~/data/mijn'

definePageMeta({ layout: 'mijn', middleware: 'mijn-guest' })
useHead({ title: mijnForgot.title })
</script>

<template>
  <MijnEmailRequest endpoint="/api/mijn/password/forgot" :copy="mijnForgot" />
</template>
