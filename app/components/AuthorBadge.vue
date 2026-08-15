<script setup lang="ts">
/**
 * The author line under a card and beside an article title — bijlesbeta.nl's
 * Elementor author box, measured from `post-169.css`: a 45px avatar on the
 * 8px surface radius with a black/10 hairline, 12px of gap, and the name in
 * Plus Jakarta Sans 15px/700 on `ink-850`.
 *
 * The avatar file is looked up by author name in `authorAvatars`. Nothing
 * breaks while the artwork is still missing: a file that 404s falls back to
 * the same initial tile an unmapped author gets.
 */
import { authorAvatars } from '~/data/kennisbank'

const props = defineProps<{ name: string; size?: number }>()

const box = computed(() => `${props.size ?? 45}px`)
const src = computed(() => authorAvatars[props.name])
const failed = ref(false)
const initial = computed(() => props.name.trim().charAt(0).toUpperCase())
</script>

<template>
  <div class="flex items-center gap-3">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="name"
      :style="{ width: box, height: box }"
      class="flex-none rounded-panel border border-black/10 object-cover"
      loading="lazy"
      @error="failed = true"
    >
    <span
      v-else
      :style="{ width: box, height: box }"
      class="flex flex-none items-center justify-center rounded-panel border border-black/10 bg-mist font-display text-[15px] font-bold text-ink-400"
      aria-hidden="true"
    >{{ initial }}</span>
    <span class="font-display text-[15px] leading-[26px] font-bold text-ink-850">{{ name }}</span>
  </div>
</template>
