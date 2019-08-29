'use strict';
const path = require('path');
const { getRouteName } = require('rax-compile-config');

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
    const pathName = getRouteName(route, rootDir);
    let routePath = route.path;
    if (isMultiPages) {
      routePath = new RegExp(`\/pages\/${pathName}\\/?((?!\\.(js|html|css|json)).)*$`);
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
