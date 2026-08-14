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
  <!--
    The band carries the live 80px rhythm on both of its own edges, so pages
    mount it directly against the section before and after rather than adding
    spacer strips of their own.
  -->
  <section class="bg-white px-[clamp(16px,4vw,40px)] py-20">
    <div ref="band" class="mx-auto max-w-[900px] text-center">
      <h2 class="text-[32px] leading-[44px] text-accent-500">{{ statsIntro.title }}</h2>

      <p class="mx-auto mt-3 mb-3 max-w-[800px] text-base leading-[28px] text-ink-800">
        {{ statsIntro.body }}<strong>{{ statsIntro.emphasis }}</strong>
      </p>

      <div class="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="rounded-tile border border-line-ink p-6"
        >
          <p class="text-[50px] leading-none font-bold tracking-[-0.035em] text-ink-800">
            {{ displayed[index] }}{{ stat.suffix }}
          </p>
          <p class="text-[15px] leading-[37.5px] font-semibold text-ink-800">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
