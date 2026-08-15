<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- Here rather than in `default`, so it also covers `bare` (/aanmelden)
         and `landing` — a consent banner that skips pages is worse than none. -->
    <CookieBanner />
  </div>
</template>
