import { resolve } from 'path';

import { formatMessage } from './utils';

export default function datocmsModule () {
  const options = this.options.datocms || {};

  if (!options.datocmsReadOnlyToken) {
    throw new Error(formatMessage('datocmsReadOnlyToken must be defined'));
  }

  this.addPlugin({
    src: resolve('./plugin.js'),
    options,
  });
}

// eslint-disable-next-line global-require
export const meta = require('../package.json');
