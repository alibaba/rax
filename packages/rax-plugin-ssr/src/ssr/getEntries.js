const path = require('path');
const qs = require('querystring');

const SSRLoader = require.resolve('./loader');

module.exports = (rootDir) => {
  const appDirectory = rootDir;
  const appSrc = path.resolve(appDirectory, 'src');

  const absoluteAppPath = path.join(appDirectory, 'src/app.js');
  const absoluteAppJSONPath = path.join(appDirectory, 'src/app.json');
  const absoluteDocumentPath = path.join(appDirectory, 'src/document/index.jsx');
  const absoluteShellPath = path.join(appDirectory, 'src/shell/index.jsx');

  const appJSON = require(absoluteAppJSONPath);
  const routes = appJSON.routes;

  const entries = {};

  routes.forEach((route) => {
    const entry = route.name || route.component.replace(/\//g, '_');
    const absolutePagePath = path.resolve(appSrc, route.component);

    const query = {
      path: route.path,
      absoluteDocumentPath,
      absoluteShellPath,
      absoluteAppPath,
      absolutePagePath,
      absoluteAppJSONPath,
      publicPath: '/'
    };

    entries[entry] = `${SSRLoader}?${qs.stringify(query)}!${absolutePagePath}`;
  });

  return entries;
};
