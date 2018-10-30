const { relative, extname } = require('path');
const { existsSync, readFileSync } = require('fs');
const { stringifyRequest, getOptions } = require('loader-utils');
const { compileToES5, QueryString, createRequire, createRequireDefault } = require('./shared/utils');
const paths = require('./paths');
const tplLoaderPath = require.resolve('./template');
const createPageReq = createRequireDefault(stringifyRequest(this, paths.createComponent));

module.exports = function(content) {
  const { resourcePath } = this;
  const basePath = resourcePath.replace(extname(resourcePath), '');

  if (existsSync(basePath + '.js')) {
    this.addDependency(basePath + '.js');
  }
  let stylePath = null;
  if (existsSync(basePath + '.acss')) {
    this.addDependency(stylePath = basePath + '.acss');
  }
  const tplQueryString = new QueryString({
    type: 'my',
    stylePath,
    isPage: false,
    dependencyComponents: null,
  });
  const regTemplateReq = createRequire(stringifyRequest(this, `${tplLoaderPath}?${tplQueryString}!${basePath + '.axml'}`));
  return `module.exports = function(Rax) {
      function Component(config) { Component.config = config; }
      ${readFileSync(basePath + '.js', 'utf-8')}
      return ${createPageReq}(Component.config, Rax, ${regTemplateReq});
    };
  `;
}
