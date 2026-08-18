<script setup lang="ts">
/**
 * One piece of LaTeX, rendered with KaTeX.
 *
 * bijlesbeta.nl writes its maths as LaTeX and hands it to the QuickLaTeX
 * WordPress plugin, which renders each formula to a PNG on its own servers and
 * drops an `<img>` in the copy. We keep the LaTeX — see the `tex` run in
 * `data/kennisbank.ts` — and render it here instead, so a formula is real text
 * that scales with the reader's font size, can be selected and copied, and
 * needs no round trip to a third party.
 *
 * `renderToString` runs on the server as well as the client and is
 * deterministic, so the markup hydrates without a mismatch and a formula is
 * never a blank space while a script loads. `v-html` is safe here because the
 * input is our own content module, never anything a visitor supplies, and
 * KaTeX escapes what it emits.
 *
 * `throwOnError: false` renders a malformed formula in red rather than
 * throwing, which would take the whole page down over one stray backslash.
 * Nothing in the kennisbank fails today — the 435 formulas all parse — but a
 * typo in a future article shouldn't be a 500.
 */
import katex from 'katex'

const props = defineProps<{
  /** The LaTeX source, without its surrounding dollar signs. */
  tex: string
  /** Displayed maths — its own centred line — rather than maths inline in a sentence. */
  display?: boolean
}>()

const html = computed(() =>
  katex.renderToString(props.tex, {
    displayMode: props.display ?? false,
    throwOnError: false,
    strict: false,
    // KaTeX's default: the visual layer is `aria-hidden` and a MathML copy
    // sits beside it, which is what a screen reader reads out. The plugin the
    // live site uses ships a flat PNG with the LaTeX source as its alt text,
    // so this is the one place the maths is more accessible here than there.
    output: 'htmlAndMathml',
  }),
)
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <span :class="display ? 'block' : 'inline'" v-html="html" />
</template>
