// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv-safe';

dotenv.config();

export default {
  target: 'static',

  modules: [
    '@voorhoede/nuxt-preview-mode-module',
    '@voorhoede/nuxt-datocms-module',
  ],

  datocms: {
    datocmsReadOnlyToken: process.env.DATO_READ_ONLY_TOKEN,
  },

  previewMode: {
    previewSecret: 'secret',
  },
};
