declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Ground colour of the strip behind the floating header bar. Defaults to
     * none — the page's own band shows through, as on the live site. Pages
     * whose hero opens on the dark band set `ink` so the strip continues it
     * instead of cutting a pale line above the hero.
     */
    headerGround?: 'cream' | 'ink'
    /**
     * Takes the header out of flow and fixes it over the top of the page, so
     * the page's hero photograph runs up behind the bar. The page must pad
     * its hero by the strip's height itself — see `/`'s hero.
     */
    headerOverlay?: boolean
  }
}

export {}
