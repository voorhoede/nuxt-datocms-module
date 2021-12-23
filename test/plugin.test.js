import * as datocmsListen from 'datocms-listen';
import fetchMock from 'fetch-mock';

import plugin from '../lib/plugin';

jest.mock('datocms-listen', () => ({
  subscribeToQuery: jest.fn(),
}));

const routeChangeHooks = [];
const mockContext = {
  app: {
    router: {
      afterEach (callback) {
        routeChangeHooks.push(callback);
      },
    },
    context: {
      preview: undefined,
    },
  },
};

describe('Plugin', () => {
  const query = 'query { home { title } }';

  beforeAll(() => {
    function mockInject (name, plugin) {
      mockContext[`$${name}`] = plugin;
    }

    plugin(mockContext, mockInject);
  });

  describe('Query', () => {
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

  describe('Subscribe', () => {
    it('Doesn\'t subscribe when `enabled` is set to `false`', async () => {
      await mockContext.$datocms.subscribe({
        query,
        enabled: false,
        onUpdate: () => {},
      });
      expect(datocmsListen.subscribeToQuery).not.toHaveBeenCalled();
    });

    it('Still returns a function when `enabled` is set to `false`', async () => {
      const unsubscribe = await mockContext.$datocms.subscribe({
        query,
        enabled: false,
        onUpdate: () => {},
      });
      expect(typeof unsubscribe).toBe('function');
    });

    it('Does subscribe when `enabled` is set to `true`', async () => {
      await mockContext.$datocms.subscribe({
        query,
        enabled: true,
        onUpdate: () => {},
      });
      expect(datocmsListen.subscribeToQuery).toHaveBeenCalled();
    });

    it('Unsubscribes on route change', async () => {
      const unsubscribe = jest.fn();
      jest
        .spyOn(datocmsListen, 'subscribeToQuery')
        .mockImplementation(
          () => Promise.resolve(unsubscribe)
        );
      await mockContext.$datocms.subscribe({
        query,
        enabled: true,
        onUpdate: () => {},
      });
      routeChangeHooks.forEach(callback => callback());
      expect(unsubscribe).toHaveBeenCalled();
    });

    it('Unsubscribes when unsubscribe is called', async () => {
      const unsubscribe = jest.fn();
      jest
        .spyOn(datocmsListen, 'subscribeToQuery')
        .mockImplementation(
          () => Promise.resolve(unsubscribe)
        );
      const unsubscribeCallback = await mockContext.$datocms.subscribe({
        query,
        enabled: true,
        onUpdate: () => {},
      });
      unsubscribeCallback();
      expect(unsubscribe).toHaveBeenCalled();
    });

    it('Unsubscribes once when unsubscribe is called and then route is changed', async () => {
      const unsubscribe = jest.fn();
      jest
        .spyOn(datocmsListen, 'subscribeToQuery')
        .mockImplementation(
          () => Promise.resolve(unsubscribe)
        );
      const unsubscribeCallback = await mockContext.$datocms.subscribe({
        query,
        enabled: true,
        onUpdate: () => {},
      });
      unsubscribeCallback();
      routeChangeHooks.forEach(callback => callback());
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('Calls `onUpdate` with response data when new data comes in', () => {
      const response = {
        response: {
          data: {
            home: { title: 'title-1' },
          },
        },
      };

      function onUpdate (data) {
        expect(data).toEqual(response.response.data);
      }

      jest
        .spyOn(datocmsListen, 'subscribeToQuery')
        .mockImplementation(({ onUpdate }) => {
          onUpdate(response);
        });

      mockContext.$datocms.subscribe({
        query,
        enabled: true,
        onUpdate,
      });
    });

    it('Calls `onStatusChange` when subscription status changes', () => {
      const connectionStatus = 'connecting';
      function onStatusChange (updatedStatus) {
        expect(updatedStatus).toEqual(connectionStatus);
      }

      jest
        .spyOn(datocmsListen, 'subscribeToQuery')
        .mockImplementation(({ onStatusChange }) => {
          onStatusChange(connectionStatus);
        });

      mockContext.$datocms.subscribe({
        query,
        enabled: true,
        onUpdate: () => {},
        onStatusChange,
      });
    });

    it('Calls `onChannelError` when an error occurs', () => {
      const channelError = {
        code: 'INVALID_QUERY',
        message: 'Field title does not exist on home',
        fatal: true,
      };
      function onChannelError (error) {
        expect(error).toEqual(channelError);
      }

      jest
        .spyOn(datocmsListen, 'subscribeToQuery')
        .mockImplementation(({ onChannelError }) => {
          onChannelError(channelError);
        });

      mockContext.$datocms.subscribe({
        query,
        enabled: true,
        onUpdate: () => {},
        onChannelError,
      });
    });
  });
});
