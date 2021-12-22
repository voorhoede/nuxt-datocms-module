// @ts-check

// isomorphic fetch assigns to global fetch.
// By importing as `fetch`, `fetch-mock` doesn't work in our tests anymore
import 'isomorphic-fetch';
import { subscribeToQuery } from 'datocms-listen';

const PUBLISHED_ENDPOINT = 'https://graphql.datocms.com/';
const PREVIEW_ENDPOINT = 'https://graphql.datocms.com/preview';
const LISTEN_ENDPOINT = 'https://graphql-listen.datocms.com/';

/**
 * @type {import('@nuxt/types').Plugin}
 */
export default ({ app }, inject) => {
  const token = '<%= options.datocmsReadOnlyToken %>';
  let unsubscribes = {};

  app.router.afterEach(() => {
    Object.values(unsubscribes).forEach(unsubscribe => unsubscribe());
    unsubscribes = {};
  });

  return inject('datocms', {
    /**
     * @param {import('../types/index').QueryOptions} queryOptions
     * @returns {Promise<object>}
     */
    async query ({
      query,
      variables = {},
      preview = app.context.$preview,
    }) {
      const endpoint = preview
        ? PREVIEW_ENDPOINT
        : PUBLISHED_ENDPOINT;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ query, variables }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await response.json();

      if (body?.errors) {
        throw body.errors[0];
      }

      if (!body?.data) {
        throw new Error('Empty response');
      }

      return body.data;
    },

    /**
     * Subscribe to changes on query.
     * @param {import('../types/index').SubscribeOptions} subscribeOptions
     * @returns {Promise<(unsubscribe: import('datocms-listen').UnsubscribeFn) => void>}
     */
    async subscribe ({
      query,
      variables = {},
      onUpdate,
      onStatusChange,
      onChannelError,
      // app.context.$preview is the preview data.
      // It's an object in preview mode, and undefined when not in preview mode.
      enabled = app.context.$preview,
      preview = app.context.$preview,
      unsubscribeOnRouteChange = true,
    }) {
      if (!enabled) {
        return () => {};
      }

      const unsubscribe = await subscribeToQuery({
        baseUrl: LISTEN_ENDPOINT,
        token,
        query,
        variables,
        preview,
        onUpdate: update => onUpdate(update.response.data),
        onStatusChange (status) {
          if (onStatusChange) {
            onStatusChange(status);
          }
        },
        onChannelError (error) {
          if (onChannelError) {
            onChannelError(error);
          }
        },
      });

      if (!unsubscribeOnRouteChange) {
        return unsubscribe;
      }

      const unsubscribeKey = `${query}.${JSON.stringify(variables)}`;
      unsubscribes[unsubscribeKey] = unsubscribe;

      return () => {
        unsubscribe();
        delete unsubscribes[unsubscribeKey];
      };
    },
  });
};
