<script setup lang="ts">
/*
  One block per hour, in the order the hours are used up: the package first,
  then the credit (dashed), then extra hours (dark). Each block fills as far
  as the hours followed reach it, so the bar explains why an hour is extra.
*/
const props = defineProps<{ used: number, hours: number, credit: number, label: string }>()

const blocks = computed(() => {
  const packageHours = Math.ceil(props.hours)
  const creditHours = Math.ceil(props.credit)
  const extraHours = Math.ceil(Math.max(0, props.used - (props.hours + props.credit)))

  const kinds = [
    ...Array<'package'>(packageHours).fill('package'),
    ...Array<'credit'>(creditHours).fill('credit'),
    ...Array<'extra'>(extraHours).fill('extra'),
  ]

  return kinds.map((kind, i) => ({
    kind,
    fill: Math.max(0, Math.min(1, props.used - i)) * 100,
  }))
})

const fillClass = { package: 'bg-accent-500', credit: 'bg-accent-500/60', extra: 'bg-ink-900' }
</script>

<template>
  <div class="flex gap-1" role="img" :aria-label="label">
    <div
      v-for="(block, i) in blocks"
      :key="i"
      class="relative h-[22px] min-w-0 flex-1 overflow-hidden rounded-[4px] bg-sand"
      :class="block.kind === 'credit' ? 'border-2 border-dashed border-ink-900/40' : ''"
    >
      <div class="absolute inset-y-0 left-0" :class="fillClass[block.kind]" :style="{ width: `${block.fill}%` }" />
    </div>
  </div>
</template>
