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

    app.get('/*', function(req, res) {
      const url = req.url.lastIndexOf('/') === req.url.length - 1 ? 'web/index.html' : req.url;
      let filePath = path.join(rootDir, outputDir, url);

      if (!memFs.existsSync(filePath)) {
        filePath = htmlPath;
      }

      const outPut = memFs.readFileSync(filePath).toString();
      const mimeType = mime.getType(filePath);
      res.setHeader('Content-Type', `${mimeType}; charset=utf8`);
      res.send(outPut);
    });
  });
};
