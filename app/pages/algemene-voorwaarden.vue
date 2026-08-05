<script setup lang="ts">
import { terms, termsPdf } from '~/data/legal'

useSeoMeta({
  title: terms.title,
  description: terms.description,
})
</script>

<template>
  <LegalDocument :doc="terms">
    <template #before-body>
      <!-- The PDF band. The file itself lives in `public/downloads/`. -->
      <section class="border-b border-line-200 bg-sand">
        <div
          class="container-page flex flex-wrap items-center justify-between gap-4 py-5 max-w-[820px]"
        >
          <p class="text-[14.5px] text-ink-700">{{ termsPdf.label }}</p>
          <a :href="termsPdf.href" download class="btn-primary">
            <svg
              class="h-[17px] w-[17px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 4v11" />
              <path d="M7 12l5 5 5-5" />
              <path d="M5 20h14" />
            </svg>
            {{ termsPdf.button }}
          </a>
        </div>
      </section>
    </template>
  </LegalDocument>
</template>
