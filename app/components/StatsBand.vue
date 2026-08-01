<script setup lang="ts">
import { stats, statsIntro } from '~/data/site'

const band = ref<HTMLElement | null>(null)

/**
 * Rendered at their final values, so the numbers are correct without
 * JavaScript and correct for search engines. The count-up only kicks in when
 * the band is still below the fold at mount — resetting to zero while it's
 * already on screen would read as a flicker, so in that case it's skipped.
 */
const displayed = ref<number[]>(stats.map((stat) => stat.value))

let observer: IntersectionObserver | undefined
let frame: number | undefined

const DURATION = 1000

function countUp() {
  const start = performance.now()

  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / DURATION)
    const eased = 1 - (1 - progress) ** 3

    displayed.value = stats.map((stat) => Math.round(stat.value * eased))

    if (progress < 1) frame = requestAnimationFrame(tick)
  }

  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  const element = band.value
  if (!element || !('IntersectionObserver' in window)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const rect = element.getBoundingClientRect()
  if (rect.top < window.innerHeight && rect.bottom > 0) return

  displayed.value = stats.map(() => 0)

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer?.disconnect()
        countUp()
      }
    },
    { threshold: 0.4 },
  )

  observer.observe(element)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <section class="bg-white px-[clamp(16px,4vw,24px)] pt-[clamp(30px,4vw,50px)] pb-[clamp(56px,7vw,90px)]">
    <div ref="band" class="mx-auto max-w-[820px] text-center">
      <h2 class="text-[clamp(26px,3.2vw,36px)] text-accent-500">{{ statsIntro.title }}</h2>

      <p
        class="mx-auto mt-3.5 mb-[clamp(26px,3.5vw,38px)] max-w-[62ch] text-[15px] leading-[1.7] text-ink-700"
      >
        {{ statsIntro.body }}<strong>{{ statsIntro.emphasis }}</strong>
      </p>

      <div class="grid gap-[clamp(12px,1.6vw,18px)] [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="rounded-tile border border-line-200 bg-ivory px-3 py-[30px]"
        >
          <p class="text-[clamp(32px,4vw,44px)] font-bold leading-none tracking-[-0.035em]">
            {{ displayed[index] }}{{ stat.suffix }}
          </p>
          <p class="mt-2.5 text-[13.5px] text-ink-600">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
