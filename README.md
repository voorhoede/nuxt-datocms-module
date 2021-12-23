# @voorhoede/nuxt-datocms-module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]


## Setup

1. Add `@voorhoede/nuxt-datocms-module` dependency to your project

```bash
yarn add @voorhoede/nuxt-datocms-module # or npm install @voorhoede/nuxt-datocms-module
```

2. Add `@voorhoede/nuxt-datocms-module` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    '@voorhoede/nuxt-datocms-module',
  ]
}
```

## Options

You can pass different options using the `datocms` property in your `nuxt.config.js`:

```js
export default {
  datocms: {
    // options go here
  },
}
```

### `datoCmsReadOnlyToken`

* Required: `true`

DatoCMS API token. Will be injected in the client side bundle, so ALWAYS use a readonly token.

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## Usage

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
<template>
  <div>
    <h1>Live feed</h1>
    <ul>
      <li v-for="item in feedItems" :key="item.id">
        <h2>{{ item.title }}</h2>
      </li>
    </ul>
    <button v-if="unsubscribe" @click="unsubscribe">Stop updates</button>
  </div>
</template>

<script>
  const query = `
    query ($locale: SiteLocale!) {
      home (locale: $locale) {
        liveFeedItems {
          title
        }
      }
    }
  `;

  export default {
    data() {
      return {
        liveFeedItems: [],
        status: null,
        error: null,
        unsubscribe: null,
      }
    },
    async mounted () {
      this.unsubscribe = await this.$datocms.subscribe({
        query,
        variables: {
          locale: 'en',
        },
        enabled: true,
        preview: false,
        onUpdate: (data) => {
          this.liveFeedItems = data.home.liveFeedItems;
        },
        onStatusChange: (status) => {
          this.status = status;
        },
        onChannelError: (error) => {
          this.error = error;
        },
      });
    },
  };
</script>
```

## License

[MIT License](./LICENSE)

Copyright (c) Voorhoede

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@voorhoede/nuxt-datocms-module/latest.svg
[npm-version-href]: https://npmjs.com/package/@voorhoede/nuxt-datocms-module

[npm-downloads-src]: https://img.shields.io/npm/dt/@voorhoede/nuxt-datocms-module.svg
[npm-downloads-href]: https://npmjs.com/package/@voorhoede/nuxt-datocms-module

[github-actions-ci-src]: https://github.com/voorhoede/nuxt-datocms-module/actions/workflows/ci.yml/badge.svg
[github-actions-ci-href]: https://github.com/voorhoede/nuxt-datocms-module/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/git@github.com:voorhoede/nuxt-datocms-module.git.svg
[codecov-href]: https://codecov.io/gh/git@github.com:voorhoede/nuxt-datocms-module.git

[license-src]: https://img.shields.io/npm/l/@voorhoede/nuxt-datocms-module.svg
[license-href]: https://npmjs.com/package/@voorhoede/nuxt-datocms-module
