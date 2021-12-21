import datocmsModule from '../../lib/module';

export default {
  target: 'static',

  buildModules: [
    '@nuxt/typescript-build',
    datocmsModule,
  ],
};
