<script setup lang="ts">
import { privacy } from '~/data/legal'

useSeoMeta({
  title: privacy.title,
  description: privacy.description,
})
</script>

<template>
  <LegalDocument :doc="privacy" />
</template>
