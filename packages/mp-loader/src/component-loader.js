const querystring = require('querystring');
const { extname } = require('path');
const { readFileSync, existsSync } = require('fs');
const { stringifyRequest } = require('loader-utils');
const { createRequire } = require('./utils');
const runtimeHelpers = require('./runtimeHelpers');
const resolveDependencyComponents = require('./component-resolver');

const templateLoaderPath = require.resolve('./template-loader');
const requireCreatePage = createRequire(stringifyRequest(this, runtimeHelpers.createComponent));
const CSS_EXT = '.acss';
const TEMPLATE_EXT = '.axml';
const CONFIG_EXT = '.json';

module.exports = function(content) {
  const { resourcePath } = this;
  const basePath = resourcePath.replace(extname(resourcePath), '');
  let cssPath = basePath + CSS_EXT;
  let templatePath = basePath + TEMPLATE_EXT;
  let configPath = basePath + CONFIG_EXT;

  // Component dependents components
  let config = {};
  if (existsSync(configPath)) {
    config = JSON.parse(readFileSync(configPath, 'utf-8'));
    this.addDependency(configPath);
  }

  const dependencyComponents = resolveDependencyComponents(config, this.rootContext, basePath);
  const templateLoaderQueryString = querystring.stringify({
    cssPath,
    isEntryTemplate: false,
    dependencyComponents: JSON.stringify(dependencyComponents),
  });

  const requireTemplate = createRequire(stringifyRequest(this, `${templateLoaderPath}?${templateLoaderQueryString}!${templatePath}`));

  return `module.exports = function(__render__) {
      function Component(config) { Component.__config__ = config; }
      ${content}
      return ${requireCreatePage}(Component.__config__, __render__, ${requireTemplate});
    };
  `;
};
