'use strict';
const path = require('path');

module.exports = (config, context) => {
  const { rootDir, userConfig } = context;
  const { plugins } = userConfig;
  const isMultiPages = !!~plugins.indexOf('rax-plugin-multi-pages');

  config.mode('development');

  const absoluteAppJSONPath = path.join(rootDir, 'src/app.json');
  const appJSON = require(absoluteAppJSONPath);

  const distDir = config.output.get('path');
  const filename = config.output.get('filename');

  const routes = [];

  appJSON.routes.forEach((route) => {
    const pathName = route.name || route.component.replace(/\//g, '_');
    let routePath = route.path;
    if (isMultiPages) {
      routePath = `/web/${pathName}`;
    }
    routes.push({
      path: routePath,
      component: path.join(distDir, filename.replace('[name]', pathName))
    });
  });

  config.devServer.hot(false);

  config.devServer.set('before', (app, devServer) => {
    const memFs = devServer.compiler.compilers[0].outputFileSystem;
    routes.forEach((route) => {
      app.get(route.path, function(req, res) {
        const bundleContent = memFs.readFileSync(route.component, 'utf8');
        const mod = eval(bundleContent);
        const page = mod.default || mod;

        page.render(req, res);
      });
    });
  });

  return config;
};
