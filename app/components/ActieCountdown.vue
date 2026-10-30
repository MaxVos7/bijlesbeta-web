<script setup lang="ts">
/**
 * A campaign's countdown as four ink tiles — dagen, uren, min, sec — under a
 * one-line label, made to sit on the amber form panel. Before the clock is
 * mounted the tiles show `--` at the same size, so nothing shifts when it
 * starts; once the end has passed the tiles give way to `copy.ended`.
 */
const props = defineProps<{
  end: string
  copy: {
    label: string
    ended: string
    units: { days: [string, string], hours: string, minutes: string, seconds: string }
  }
}>()

const { parts, ended } = useCountdown(props.end)

const pad = (n: number) => String(n).padStart(2, '0')

const tiles = computed(() => {
  const p = parts.value
  const { units } = props.copy
  return [
    { value: p ? String(p.days) : '--', unit: p?.days === 1 ? units.days[0] : units.days[1] },
    { value: p ? pad(p.hours) : '--', unit: units.hours },
    { value: p ? pad(p.minutes) : '--', unit: units.minutes },
    { value: p ? pad(p.seconds) : '--', unit: units.seconds },
  ]
})
</script>

<template>
  <div>
    <p v-if="ended" class="font-display text-sm font-bold text-ink-900">{{ copy.ended }}</p>
    <template v-else>
      <p class="mb-2 font-display text-[13px] font-bold text-ink-900">{{ copy.label }}</p>
      <!-- Read out once, not every second: the tiles are hidden from
           assistive tech and the label above carries the meaning. -->
      <div class="grid grid-cols-4 gap-2" aria-hidden="true">
        <div
          v-for="tile in tiles"
          :key="tile.unit"
          class="flex flex-col items-center rounded-field bg-ink-900 px-1 pt-2 pb-1.5 text-white"
        >
          <span class="font-display text-[clamp(22px,2.4vw,28px)] leading-none font-bold tabular-nums">{{ tile.value }}</span>
          <span class="mt-1 text-[11px] leading-none text-white/70">{{ tile.unit }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
