// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv-safe';
import { resolve } from 'path';

dotenv.config();

export default {
  target: 'static',

  buildModules: [
    '@voorhoede/nuxt-preview-mode-module',
    resolve('../lib/module.js'),
  ],

  datocms: {
    datocmsReadOnlyToken: process.env.DATO_READ_ONLY_TOKEN,
  },

  previewMode: {
    previewSecret: 'secret',
  },
};
