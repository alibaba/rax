'use strict';

const path = require('path');
const serverRender = require('rax-server-renderer');
const UniversalDocumentPlugin = require('../../plugins/UniversalDocumentPlugin');
const PWAAppShellPlugin = require('../../plugins/PWAAppShellPlugin');
const getWebpackBase = require('../getWebpackBase');

const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

module.exports = (context) => {
  const { rootDir } = context;

  const appEntry = path.resolve(rootDir, 'src/app.js');

  const config = getWebpackBase(context);

  config.output.filename('web/[name].js');
  config.entry('index')
    .add(`${UNIVERSAL_APP_SHELL_LOADER}?type=web!${appEntry}`);

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
