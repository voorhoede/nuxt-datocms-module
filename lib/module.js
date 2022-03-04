import { formatMessage } from './utils';

export default function datocmsModule (moduleOptions) {
  const options = {
    ...this.options.datocms,
    ...moduleOptions,
  };

  if (!options.datocmsReadOnlyToken) {
    throw new Error(formatMessage('datocmsReadOnlyToken must be defined'));
  }

  this.addPlugin({
    src: require.resolve('./plugin.js'),
    options,
  });
}

// eslint-disable-next-line global-require
export const meta = require('../package.json');
