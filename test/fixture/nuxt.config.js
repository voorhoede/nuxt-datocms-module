import datocmsModule from '../../lib/module';

export default {
  target: 'static',

  buildModules: [
    datocmsModule,
  ],

  datocms: {
    datoReadOnlyToken: 'my-token',
  },
};
