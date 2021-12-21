import { setupTest, createPage } from '@nuxt/test-utils';

describe('module', () => {
  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    configFile: 'nuxt.config.js',
    browser: true,
  });

  it('Preview mode is disabled by default', async () => {
    const page = await createPage('/');
    const html = await page.innerHTML('body');
    expect(html).toContain('Works');
  });
});
