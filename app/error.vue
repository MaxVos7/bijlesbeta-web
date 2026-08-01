<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: isNotFound.value ? 'Pagina niet gevonden' : 'Er ging iets mis',
})
</script>

<template>
  <NuxtLayout>
    <section class="section">
      <div class="container-page max-w-2xl text-center">
        <p class="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Foutmelding {{ error.statusCode }}
        </p>
        <h1 class="mt-3 text-3xl sm:text-4xl">
          {{ isNotFound ? 'Deze pagina bestaat niet' : 'Er ging iets mis' }}
        </h1>
        <p class="mt-4 leading-relaxed text-slate-600">
          {{
            isNotFound
              ? 'De link klopt niet meer, of de pagina is verplaatst. Via het menu vind je vast wat je zocht.'
              : 'Probeer het zo nog eens. Blijft het misgaan, laat het ons dan even weten.'
          }}
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" class="btn-primary" @click="clearError({ redirect: '/' })">
            Naar de homepage
          </button>
          <button
            type="button"
            class="btn-secondary"
            @click="clearError({ redirect: '/contact' })"
          >
            Contact
          </button>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
