declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Ground colour of the strip behind the floating header bar. Defaults to
     * `cream`; pages whose hero opens on the dark band set `ink` so the strip
     * matches instead of cutting a pale line above the hero.
     */
    headerGround?: 'cream' | 'ink'
  }
}

export {}
