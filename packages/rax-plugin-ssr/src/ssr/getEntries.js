const path = require('path');
const qs = require('qs');
const { getRouteName } = require('rax-compile-config');

const SSRLoader = require.resolve('./loader');

module.exports = (config, context) => {
  const { rootDir, userConfig } = context;
  const { plugins, inlineStyle } = userConfig;
  const isMultiPages = !!~plugins.indexOf('rax-plugin-multi-pages');

  const publicPath = config.output.get('publicPath');
  const appSrc = path.resolve(rootDir, 'src');

  const absoluteAppPath = path.join(rootDir, 'src/app.js');
  const absoluteAppJSONPath = path.join(rootDir, 'src/app.json');
  const absoluteDocumentPath = path.join(rootDir, 'src/document/index.jsx');
  const absoluteShellPath = path.join(rootDir, 'src/shell/index.jsx');

  const appJSON = require(absoluteAppJSONPath);
  const routes = appJSON.routes;

  const entries = {};

  routes.forEach((route) => {
    const entry = getRouteName(route, rootDir);
    const absolutePagePath = path.resolve(appSrc, route.component);

    const query = {
      path: route.path,
      pageName: entry,
      absoluteDocumentPath,
      absoluteShellPath,
      absoluteAppPath,
      absolutePagePath,
      absoluteAppJSONPath,
      publicPath,
      isMultiPages,
      styles: inlineStyle ? [] : [`web/${entry}.css`],
      scripts: isMultiPages ? [`web/${entry}.js`] : [`web/${entry}.js`, 'web/index.js']
    };

    entries[entry] = `${SSRLoader}?${qs.stringify(query)}!${absolutePagePath}`;
  });

  return entries;
};
