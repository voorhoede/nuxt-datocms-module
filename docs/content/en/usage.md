---
title: Usage
description: ''
position: 3
category: Introduction
---

The module injects a `$datocms` plugin into the nuxt context, containing the following methods:

### `query`

* Arguments
  * Options (type: `object`)
    * @property `query` (type: `string`, required) GraphQL query string
    * @property `variables` (type: `object`, optional) GraphQL query variables
    * @property `preview` (type: `boolean`, optional, default: whether [Nuxt's preview mode](https://nuxtjs.org/docs/features/live-preview) is enabled) Whether to use [Datocms's preview endpoint](https://www.datocms.com/docs/content-delivery-api/api-endpoints#preview-endpoint)
* Returns: `Promise<object>`

Returns the graphql query response data.

#### Example

```vue
<script>
const query = `
  query ($locale: SiteLocale!) {
    home (locale: $locale) {
      title
    }
  }
`;

export default {
  asyncData ({ $datocms }) {
    return $datocms.query({
      query,
      variables: {
        locale: 'en',
      },
      preview: true
    });
  },
};
</script>
```

### `subscribe`

* Arguments
  * Options (type: `object`)
    * @property `query` (type: `string`, required) GraphQL query string
    * @property `variables` (type: `object`, optional) GraphQL query variables
    * @property `enabled` (type: `boolean`, default: `app.context.$preview`) by default, subscriptions are disabled outside [Nuxt's preview mode](https://nuxtjs.org/docs/features/live-preview)
    * @property `preview` (type: `boolean`, default: `app.context.$preview`) by default, preview is set to whether [Nuxt's preview mode](https://nuxtjs.org/docs/features/live-preview) is enabled
    * @property `onUpdate` (type: `function`, required) callback for new data for the subscription
    * @property `onStatusChange` (type: `function`, optional) callback for status changes of the subscription
    * @property `onChannelError` (type: `function`, optional) callback for errors on the subscription
    * @property `unsubscribeOnRouteChange` (type: `boolean`, default: `true`) By default the subscription is ended on route change, which is advised for page data. Can be overwritten for layout data for instance.
* Returns: `boolean<object>`

Returns a function close the subscription.

#### Example

```vue
<script>
const query = `
  query ($locale: SiteLocale!) {
    home (locale: $locale) {
      title
    }
  }
`;

export default {
  mounted() {
    // Default implementation only enabled in preview mode,
    // so content managers can see their changes live.
    // Will be unsubscribed automatically on route changes.
    this.$datocms.subscribe({
      query,
      variables: {
        locale: 'en',
      },
      onUpdate: (data) => {
        this.home = data.home;
      },
    });
  }
};
</script>
```
