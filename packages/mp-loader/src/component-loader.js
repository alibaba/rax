const querystring = require('querystring');
const { extname, relative } = require('path');
const { readFileSync, existsSync } = require('fs');
const { stringifyRequest } = require('loader-utils');
const { createRequire } = require('./utils');
const runtimeHelpers = require('./runtimeHelpers');
const resolveDependencyComponents = require('./component-resolver');

const templateLoaderPath = require.resolve('./template-loader');
const requireCreateComponent = createRequire(stringifyRequest(this, runtimeHelpers.createComponent));
const CSS_EXT = '.acss';
const TEMPLATE_EXT = '.axml';
const CONFIG_EXT = '.json';
const NODE_MODULES_REG = /^node_modules\//;

/**
 * Check component path is an npm module.
 * @param p {String} path to component.
 * @return {boolean}
 */
function isNodeModule(p) {
  return NODE_MODULES_REG.test(p);
}

module.exports = function(content) {
  const { resourcePath, rootContext } = this;

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
    isEntryTemplate: false,
    componentBasePath: basePath,
    dependencyComponents: JSON.stringify(dependencyComponents),
  });

  const requireTemplate = createRequire(stringifyRequest(this, `${templateLoaderPath}?${templateLoaderQueryString}!${templatePath}`));

  /**
   * Get component path, if component is in project file,
   * component path will be absolute path and start with '/',
   * if component is an npm module, path start with npm name.
   * eg:
   *    /components/foo/foo     ->  local file
   *    xxxx-ui/es/card/index   ->  npm module
   */
  let componentPath = relative(rootContext, basePath);
  if (isNodeModule(componentPath)) {
    componentPath = componentPath.replace(NODE_MODULES_REG, '');
  } else {
    componentPath = '/' + componentPath;
  }

  let cssRequirement = '""';
  if (existsSync(cssPath)) {
    cssRequirement = createRequire(stringifyRequest(this, cssPath));
  }

  /**
   * Call and register a component.
   *   createComponent(renderFactory, RenderEngine, config, componentPath);
   *   Detail to see mp-runtime/src/createComponent.js
   */
  return `module.exports = function(__render__) {
      function Component(config) { Component.__config = config; }
      ${content}
      return ${requireCreateComponent}(
        ${requireTemplate}, 
        __render__, 
        Component.__config,
        '${componentPath}',
        ${cssRequirement}
      );
    };
  `;
};
