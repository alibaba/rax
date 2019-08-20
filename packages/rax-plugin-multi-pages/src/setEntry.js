const { hmrClient } = require('rax-compile-config');
const getDepPath = require('./getDepPath');

const MulitPageLoader = require.resolve('./MulitPageLoader');

module.exports = (config, context, entries, type) => {
  const { rootDir, command, userConfig } = context;
  const { plugins } = userConfig;
  const isDev = command === 'dev';

  config.entryPoints.clear();

  entries.forEach(({ entryName, component }) => {
    const entryConfig = config.entry(entryName);
    if (isDev && !~plugins.indexOf('rax-plugin-ssr')) {
      entryConfig.add(hmrClient);
    }

    const pageEntry = getDepPath(rootDir, component);
    entryConfig.add(`${MulitPageLoader}?type=${type}!${pageEntry}`);
  });
};
