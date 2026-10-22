<script setup lang="ts">
/**
 * The wizard on its own, for visitors who arrive from a campaign page
 * (`/actie-utrecht/`, `/actie-groningen/`). It is `/aanmelden/` minus the
 * left column — headline, contact details and review — so there is less to
 * click away to mid-signup. `?actie=` still drives the heading and the
 * analytics inside `SignupForm`. `noindex`: it duplicates `/aanmelden/`.
 */
definePageMeta({ layout: 'bare' })

useSeo({
  title: 'Aanmelden',
  description:
    'Meld je aan voor een gratis en vrijblijvende proefles. Na je aanmelding neemt een van onze docenten contact met je op om de proefles in te plannen.',
})
useHead({ meta: [{ name: 'robots', content: 'noindex, follow' }] })
</script>

<template>
  <section class="px-[clamp(16px,4vw,40px)] py-9">
    <div id="form" class="mx-auto w-full max-w-[660px] min-w-0">
      <SignupForm />
    </div>
  </section>
</template>
