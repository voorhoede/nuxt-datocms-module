---
title: Setup
description: ''
position: 2
category: Introduction
---

Check the [Nuxt.js documentation](https://nuxtjs.org/guides/configuration-glossary/configuration-modules) for more information about installing and using modules in Nuxt.js.

## Installation

Add `@voorhoede/nuxt-datocms-module` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add @voorhoede/nuxt-datocms-module
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install @voorhoede/nuxt-datocms-module
  ```

  </code-block>
</code-group>

Then, add `@voorhoede/nuxt-datocms-module` to the `modules` section of `nuxt.config.js`:

```js[nuxt.config.js]
{
  modules: [
    '@voorhoede/nuxt-datocms-module'
  ],
  datocms: {
    datocmsReadOnlyToken: process.env.MY_SECRET
  }
}
```

<alert type="success">That's it! You can now use [$datocms](./usage) in your Nuxt app ✨</alert>
