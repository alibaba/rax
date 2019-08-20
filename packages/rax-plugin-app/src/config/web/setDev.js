'use strict';

const path = require('path');

module.exports = (config, context) => {
  const { rootDir, userConfig } = context;
  const { outputDir } = userConfig;

  // history fall back
  const htmlPath = path.resolve(rootDir, outputDir, 'web/index.html');
  config.devServer.set('before', (app, devServer) => {
    let memFs = devServer.compiler.compilers[0].outputFileSystem;

    app.get('/*', function(req, res) {
      const url = req.url.lastIndexOf('/') === req.url.length - 1 ? 'web/index.html' : req.url;
      const filePath = path.join(rootDir, outputDir, url);

      if (memFs.existsSync(filePath)) {
        const outPut = memFs.readFileSync(filePath).toString();
        res.send(outPut);
      } else {
        const outPut = memFs.readFileSync(htmlPath).toString();
        res.send(outPut);
      }
    });
  });
};
