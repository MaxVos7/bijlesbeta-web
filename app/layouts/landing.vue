<template>
  <!--
    The subject landing pages put the header inside their own dark hero, over
    the photograph, so the layout leaves it to the page. Everything else
    matches the default layout.
  -->
  <div class="flex min-h-screen flex-col">
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
