import fetchMock from 'fetch-mock';
import plugin from '../lib/plugin';

describe('Plugin', () => {
  const mockContext = {
    app: {
      router: { afterEach: jest.fn() },
      context: {
        preview: undefined,
      },
    },
  };

  beforeAll(() => {
    function mockInject (name, plugin) {
      mockContext[`$${name}`] = plugin;
    }

    plugin(mockContext, mockInject);
  });

  describe('Query', () => {
    const query = 'query { home { title } }';

    describe('Successful requests', () => {
      const responseData = {
        home: { title: 'Home' },
      };

      beforeEach(() => {
        fetchMock.mock('*', { data: responseData });
      });

      afterEach(() => {
        fetchMock.reset();
      });

      it('Uses preview endpoint when `preview` is set to `true`', async () => {
        await mockContext.$datocms.query({ query, preview: true });
        expect(fetchMock.lastUrl()).toContain('preview');
      });

      it('Uses regular endpoint when `preview` is set to `false`', async () => {
        await mockContext.$datocms.query({ query, preview: false });
        expect(fetchMock.lastUrl()).not.toContain('preview');
      });

      it('Returns graphql data from response', async () => {
        const data = await mockContext.$datocms.query({ query });
        expect(data).toEqual(responseData);
      });
    });

    afterEach(() => {
      fetchMock.reset();
    });

    it('Throws graphql errors when returned in response', async () => {
      const errors = [{
        message: 'Field \'title\' doesn\'t exist on type \'Home\'',
        locations: [{ line: 1, column: 15 }],
        path: ['query', 'home'],
        extensions: {
          code: 'undefinedField',
          typeName: 'Home',
          fieldName: 'values',
        },
      }];
      fetchMock.mock('*', { errors });
      try {
        await mockContext.$datocms.query({ query });
      } catch (errors) {
        expect(errors).toEqual(errors);
      }
    });

    it('Throws when there\'s no data in the response', async () => {
      fetchMock.mock('*', { data: null });
      await expect(() => mockContext.$datocms.query({ query })).rejects.toThrow('Empty response');
    });
  });
});
