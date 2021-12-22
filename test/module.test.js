/* eslint-disable import/no-import-module-exports */
import { setupTest, expectModuleToBeCalledWith, getNuxt } from '@nuxt/test-utils';
import module from '../lib/module';

describe('Module', () => {
  it('Throws when datoReadOnlyToken is not defined', () => {
    const nuxtScope = {
      options: {
        datocms: {
          datoReadOnlyToken: undefined,
        },
      },
    };
    const scopedModule = module.bind(nuxtScope);

    expect(() => scopedModule()).toThrow();
  });

  describe('In nuxt', () => {
    setupTest({
      testDir: __dirname,
      fixture: 'fixture',
      configFile: 'nuxt.config.js',
      browser: true,
      config: {
        datocms: {
          datocmsReadOnlyToken: 'my-token',
        },
      },
    });

    it('plugin is called', () => {
      expectModuleToBeCalledWith('addPlugin', {
        src: expect.stringContaining('plugin.js'),
        options: getNuxt().options.datocms,
      });
    });
  });
});
