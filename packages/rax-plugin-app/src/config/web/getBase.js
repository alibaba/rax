'use strict';

const UniversalDocumentPlugin = require('../../plugins/UniversalDocumentPlugin');
const PWAAppShellPlugin = require('../../plugins/PWAAppShellPlugin');
const getWebpackBase = require('../getWebpackBase');
const setEntry = require('../setEntry');
const setUserConfig = require('../user/setConfig');

module.exports = (context) => {
  const config = getWebpackBase(context);
  setEntry(config, context, 'web');

  config.output.filename('web/[name].js');

  config.plugin('document')
    .use(UniversalDocumentPlugin, [{
      path: 'src/document/index.jsx',
    }]);

  config.plugin('PWAAppShell')
    .use(PWAAppShellPlugin, [{
      path: 'src/shell/index.jsx',
    }]);

  setUserConfig(config, context, 'web');

  return config;
};
