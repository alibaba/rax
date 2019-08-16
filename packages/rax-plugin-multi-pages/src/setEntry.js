const path = require('path');
const fs = require('fs-extra');
const { hmrClient } = require('rax-compile-config');

const MulitPageLoader = require.resolve('./MulitPageLoader');

function getDepPath(rootDir, com) {
  if (com[0] === '/') {
    return path.join(rootDir, 'src', com);
  } else {
    return path.resolve(rootDir, 'src', com);
  }
};

module.exports = (config, context, type) => {
  const { rootDir, command, userConfig } = context;
  const { outputDir } = userConfig;
  const isDev = command === 'dev';

  // MPA
  let routes = [];

  try {
    routes = fs.readJsonSync(path.resolve(rootDir, 'src/app.json')).routes;
  } catch (e) {
    console.error(e);
    throw new Error('routes in app.json must be array');
  }

  config.entryPoints.clear();

  const entrys = [];

  routes.forEach((route) => {
    const entryName = route.component.replace(/pages\/([^\/]*)\/index/g, (str, $) => $);
    entrys.push(entryName);
    const entryConfig = config.entry(entryName);
    if (isDev) {
      entryConfig.add(hmrClient);
    }

    const pageEntry = getDepPath(rootDir, route.component);
    entryConfig.add(`${MulitPageLoader}?type=${type}!${pageEntry}`);
  });

  if (command === 'dev' && type === 'web') {
    config.devServer.set('before', (app, devServer) => {
      const memFs = devServer.compiler.compilers[0].outputFileSystem;
      entrys.forEach(entry => {
        app.get(`/${entry}`, function(req, res) {
          const htmlPath = path.resolve(rootDir, outputDir, `web/${entry}.html`);
          const outPut = memFs.readFileSync(htmlPath).toString();
          res.send(outPut);
        });
      });
    });
  }
};
