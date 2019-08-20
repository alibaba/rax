const path = require('path');
const qs = require('qs');

const SSRLoader = require.resolve('./loader');

module.exports = (config, context) => {
  const { rootDir } = context;
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
    const entry = route.name || route.component.replace(/\//g, '_');
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
      scripts: [`web/${entry}.js`]
    };

    entries[entry] = `${SSRLoader}?${qs.stringify(query)}!${absolutePagePath}`;
  });

  return entries;
};
