'use strict';

const path = require('path');
const mime = require('mime');

module.exports = (config, context) => {
  const { rootDir, userConfig } = context;
  const { outputDir } = userConfig;

  // history fall back
  const htmlPath = path.resolve(rootDir, outputDir, 'web/index.html');
  config.devServer.set('before', (app, devServer) => {
    let memFs = devServer.compiler.compilers[0].outputFileSystem;

    // not match .js .html files
    app.get(/^\/?((?!\.(js|html|css|json)).)*$/, function(req, res) {
      const outPut = memFs.readFileSync(htmlPath).toString();
      res.send(outPut);
    });
  });
};
