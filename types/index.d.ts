import { ConnectionStatus, ChannelErrorData, UnsubscribeFn } from 'datocms-listen';

interface DatocmsOptions {
  datocmsReadOnlyToken: string
}

interface QueryOptions {
  query: string,
  variables?: object,
  /** Whether to query preview data, defaults to whether [preview mode](https://nuxtjs.org/docs/features/live-preview/) is enabled */
  preview?: boolean
}

interface SubscribeOptions {
  /** graphql query string */
  query: string,
  /** graphql query variables */
  variables?: object,
  /** Whether to query preview data, defaults to whether [preview mode](https://nuxtjs.org/docs/features/live-preview/) is enabled */
  preview?: boolean,
  /** By default, on route changes the subscription is unsubscribed */
  unsubscribeOnRouteChange?: boolean,
  /** By default, subscriptions are by default only enabled in [preview mode](https://nuxtjs.org/docs/features/live-preview/) */
  enabled?: boolean,
  /** Callback for new data */
  onUpdate: (data: Promise<object>) => any,
  /** Callback for subscription status changes */
  onStatusChange?: (status: ConnectionStatus) => any,
  /** Callback for subscription errors */
  onChannelError?: (error: ChannelErrorData) => any,
}

interface DatocmsPlugin {
  query(options: QueryOptions): Promise<object>,
  subscribe(options: SubscribeOptions): Promise<(unsubscribe: UnsubscribeFn) => void>,
}

declare module '@nuxt/vue-app' {
  interface Context {
    $datocms: DatocmsPlugin
  }
  interface NuxtAppOptions {
    $datocms: DatocmsPlugin
  }
}

// Nuxt 2.9+
declare module '@nuxt/types' {
  interface Context {
    $datocms: DatocmsPlugin
  }

  interface NuxtAppOptions {
    $datocms?: DatocmsPlugin
  }

  interface Configuration {
    datocms?: DatocmsOptions
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $datocms: DatocmsPlugin
  }
}
