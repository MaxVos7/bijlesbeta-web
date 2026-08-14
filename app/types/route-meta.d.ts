declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Ground colour of the strip behind the floating header bar. Defaults to
     * none — the page's own band shows through, as on the live site. Pages
     * whose hero opens on the dark band set `ink` so the strip continues it
     * instead of cutting a pale line above the hero.
     */
    headerGround?: 'cream' | 'ink'
  }
}

export {}
