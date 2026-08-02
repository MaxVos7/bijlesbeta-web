<script setup lang="ts">
withDefaults(
  defineProps<{
    items: readonly string[]
    /** `tight` is the compact variant used inside the yellow trial block. */
    variant?: 'default' | 'tight'
  }>(),
  { variant: 'default' },
)
</script>

<template>
  <ul class="flex list-none flex-col p-0" :class="variant === 'tight' ? 'gap-[11px]' : 'gap-[13px]'">
    <li
      v-for="item in items"
      :key="item"
      class="flex gap-3"
      :class="
        variant === 'tight'
          ? 'items-center gap-2.5 text-[14.5px] font-medium'
          : 'items-start text-[15px] leading-snug'
      "
    >
      <svg
        class="flex-none"
        :class="
          variant === 'tight' ? 'h-[15px] w-[15px] text-success-900' : 'mt-0.5 h-4 w-4 text-success-500'
        "
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        :stroke-width="variant === 'tight' ? 3.5 : 3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M4 12l6 6L20 6" />
      </svg>
      {{ item }}
    </li>
  </ul>
</template>
