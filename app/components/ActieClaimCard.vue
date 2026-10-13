<script setup lang="ts">
import { actieUtrecht as page, totalSpots } from '~/data/actie-utrecht'
import { spotsLeft } from '~/data/openingsactie-utrecht'

/**
 * The amber proefles card on `/actie-utrecht/`: the places-claimed bar, a
 * heading and `LeadForm`. The page mounts it twice — under the hero and again
 * after the stappenplan — so each instance names itself in the office mail.
 */
defineProps<{
  /** Where the card sits, for the office mail (`LeadForm`'s `source`). */
  source: string
  positie: Positie
}>()

const claimedPct = `${((totalSpots - spotsLeft) / totalSpots) * 100}%`
</script>

<template>
  <div class="flex w-full max-w-[480px] flex-col gap-5 rounded-block bg-brand-500 p-6 md:p-8">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between gap-3 font-display text-[13px] font-bold">
        <span class="whitespace-nowrap">{{ page.form.progress }}</span>
        <span class="flex-shrink-0 whitespace-nowrap text-danger">{{ page.form.left }}</span>
      </div>
      <div
        class="h-2 overflow-hidden rounded-full bg-white/30"
        role="progressbar"
        :aria-valuenow="totalSpots - spotsLeft"
        aria-valuemin="0"
        :aria-valuemax="totalSpots"
        :aria-label="page.form.progress"
      >
        <div class="h-full bg-ink-900" :style="{ width: claimedPct }" />
      </div>
    </div>

    <h3 class="text-[19px] leading-[26px] tracking-[-0.01em] text-balance">{{ page.form.title }}</h3>

    <!-- The form sits on a linen tile inside the amber, as in TrialCta:
         an amber button on the amber block would disappear. -->
    <div class="rounded-tile bg-linen p-5">
      <LeadForm :source="source" :positie="positie" actie="utrecht" />
      <CtaNote class="mt-3" />
    </div>

    <p class="-mt-2 text-center text-[12px] text-ink-700">{{ page.validUntil }}</p>
  </div>
</template>
