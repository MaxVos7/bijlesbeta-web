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
  <!--
    The default variant is measured off bijlesbeta.nl's icon list: a 14px
    glyph, a 14px gap, then the label at 15px/22.5px semibold in the deep ink
    with 5px of its own left padding, and 5px between rows. It reads heavier
    than a normal bulleted list on purpose — these are promises, not prose.
  -->
  <!-- Rows are spaced by their own 5px of bottom padding, not by a gap — the
       live list puts the space inside the item so the last row keeps it. -->
  <ul class="flex list-none flex-col p-0" :class="variant === 'tight' ? 'gap-[11px]' : 'gap-0'">
    <li
      v-for="item in items"
      :key="item"
      class="flex"
      :class="
        variant === 'tight'
          ? 'items-center gap-2.5 text-[14.5px] font-medium'
          : 'items-start gap-3.5 pb-[5px] text-[15px] leading-[22.5px] font-semibold text-ink-800'
      "
    >
      <svg
        class="flex-none"
        :class="
          variant === 'tight'
            ? 'h-[15px] w-[15px] text-success-900'
            : 'mt-[4px] h-3.5 w-3.5 text-success-500'
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
      <span :class="variant === 'tight' ? '' : 'pl-[5px]'">{{ item }}</span>
    </li>
  </ul>
</template>
