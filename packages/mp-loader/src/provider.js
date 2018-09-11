const { relative } = require('path');
const { stringifyRequest } = require('loader-utils');
const paths = require('./paths');

module.exports = function providerLoader(content) {
  const { resourcePath } = this;
  const relativePath = relative(this.rootContext, this.resourcePath);

  const provider = [
    `var getApp = require(${stringifyRequest(this, paths.getApp)});`,
  ].join('');

  const sourceMap = {
    version: 3,
    sourceRoot: this.rootContext,
    sources: [relativePath],
    sourcesContent: [content],
    names: [],
    mappings: ''
  };

  if (/node_modules/.test(resourcePath)) {
    this.callback(null, content, sourceMap);
  } else {
    sourceMap.mappings += ';';
    this.callback(null, provider + '\n' + content, sourceMap);
  }
};
