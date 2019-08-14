'use strict';

const serverRender = require('rax-server-renderer');
const UniversalDocumentPlugin = require('../../plugins/UniversalDocumentPlugin');
const PWAAppShellPlugin = require('../../plugins/PWAAppShellPlugin');

const getWebpackBase = require('../getWebpackBase');

module.exports = (context) => {
  const { rootDir } = context;

  const config = getWebpackBase(context);

  config.output.filename('web/[name].js');

  config.plugin('document')
    .use(UniversalDocumentPlugin, [{
      rootDir,
      path: 'src/document/index.jsx',
      render: serverRender.renderToString,
    }]);

  config.plugin('PWAAppShell')
    .use(PWAAppShellPlugin, [{
      rootDir,
      path: 'src/shell/index.jsx',
      render: serverRender.renderToString,
    }]);

  return config;
};
