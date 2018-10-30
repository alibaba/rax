const querystring = require('querystring');
const { extname } = require('path');
const { existsSync } = require('fs');
const { stringifyRequest } = require('loader-utils');
const { createRequire } = require('./utils');
const runtimeHelpers = require('./runtimeHelpers');

const templateLoaderPath = require.resolve('./template-loader');
const createPageReq = createRequire(stringifyRequest(this, runtimeHelpers.createComponent));
const CSS_EXT = '.acss';
const TEMPLATE_EXT = '.axml';
const CONFIG_EXT = '.json';
const JS_EXT = '.js';

module.exports = function(content) {
  const { resourcePath } = this;
  const basePath = resourcePath.replace(extname(resourcePath), '');
  let jsPath = basePath + JS_EXT;
  let cssPath = basePath + CSS_EXT;
  let templatePath = basePath + TEMPLATE_EXT;
  let configPath = basePath + CONFIG_EXT;

  if (existsSync(jsPath)) {
    this.addDependency(jsPath);
  }
  if (existsSync(cssPath)) {
    this.addDependency(cssPath);
  }

  const templateLoaderQueryString = querystring.stringify({
    cssPath,
    isEntryTemplate: false,
  });
  const regTemplateReq = createRequire(stringifyRequest(this, `${templateLoaderPath}?${templateLoaderQueryString}!${templatePath}`));
  return `module.exports = function(__render__) {
      function Component(config) { Component.__config__ = config; }
      ${content}
      return ${createPageReq}(Component.__config__, __render__, ${regTemplateReq})
    };
  `;
};
