'use strict';

const path = require('path');
const setUserConfig = require('../user/setConfig');

module.exports = (config, context) => {
  const { rootDir, userConfig } = context;
  const { outputDir } = userConfig;

  config.devServer.set('before', (app, devServer) => {
    const memFs = devServer.compiler.compilers[0].outputFileSystem;
    app.get('/', function(req, res) {
      const htmlPath = path.resolve(rootDir, outputDir, 'web/index.html');
      const outPut = memFs.readFileSync(htmlPath).toString();
      res.send(outPut);
    });
  });

  setUserConfig(config, context, 'web');
};
