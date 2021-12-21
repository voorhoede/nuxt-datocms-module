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

## License

[MIT License](./LICENSE)

Copyright (c) Voorhoede

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@voorhoede/nuxt-datocms-module/latest.svg
[npm-version-href]: https://npmjs.com/package/@voorhoede/nuxt-datocms-module

[npm-downloads-src]: https://img.shields.io/npm/dt/@voorhoede/nuxt-datocms-module.svg
[npm-downloads-href]: https://npmjs.com/package/@voorhoede/nuxt-datocms-module

[github-actions-ci-src]: https://github.com/git@github.com:voorhoede/nuxt-datocms-module.git/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/git@github.com:voorhoede/nuxt-datocms-module.git/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/git@github.com:voorhoede/nuxt-datocms-module.git.svg
[codecov-href]: https://codecov.io/gh/git@github.com:voorhoede/nuxt-datocms-module.git

[license-src]: https://img.shields.io/npm/l/@voorhoede/nuxt-datocms-module.svg
[license-href]: https://npmjs.com/package/@voorhoede/nuxt-datocms-module
