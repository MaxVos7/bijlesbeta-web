<template>
  <!--
    The page and nothing else. bijlesbeta.nl serves `/aanmelden` with no
    header and no footer — the live document is the Elementor page on its own
    — so a visitor who has started the wizard has nothing to click away to.
    `/aanmelden` is the only route on this layout; anything else that wants
    the chrome removed should say so here rather than reaching for
    `layout: false`, which loses the page-transition wrapper too.
  -->
  <div class="flex min-h-screen flex-col">
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
