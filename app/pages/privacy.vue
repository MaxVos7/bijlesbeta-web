<script setup lang="ts">
import { privacy } from '~/data/legal'

useSeo({
  // The live <title> reads "Privacy statement"; the document's own heading
  // stays "Privacyverklaring".
  title: 'Privacy statement',
  description: privacy.description,
})
</script>

<template>
  <LegalDocument :doc="privacy" />
</template>
