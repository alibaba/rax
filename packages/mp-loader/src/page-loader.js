const { relative, extname, join } = require('path');
const { existsSync, readFileSync } = require('fs');
const querystring = require('querystring');
const { stringifyRequest, getOptions } = require('loader-utils');
const { createRequire } = require('./utils');
const runtimeHelpers = require('./runtimeHelpers');
const resolveDependencyComponents = require('./component-resolver');

const templateLoader = require.resolve('./template-loader');
const CSS_EXT = '.acss';
const TEMPLATE_EXT = '.axml';
const CONFIG_EXT = '.json';

module.exports = function(content) {
  const { appCssPath } = getOptions(this);
  const jsPath = this.resourcePath;
  const relativePath = relative(this.rootContext, jsPath);

  let basePath = jsPath.replace('.js', '');
  let cssPath = basePath + CSS_EXT;
  let templatePath = basePath + TEMPLATE_EXT;
  let configPath = basePath + CONFIG_EXT;

  let config = {};
  if (existsSync(configPath)) {
    config = JSON.parse(readFileSync(configPath, 'utf-8'));
    this.addDependency(configPath);
  }

  const dependencyComponents = resolveDependencyComponents(config, this.rootContext, basePath);
  const templateLoaderQueryString = querystring.stringify({
    appCssPath,
    cssPath,
    isEntryTemplate: true,
    dependencyComponents: JSON.stringify(dependencyComponents),
  });

  const requirePageTemplate = createRequire(stringifyRequest(this, `${templateLoader}?${templateLoaderQueryString}!${templatePath}`));
  const requireCreatePage = createRequire(stringifyRequest(this, runtimeHelpers.createPage));

  const extName = extname(relativePath);
  let pageName = relativePath.slice(0, - extName.length); // pages/index/index.js => pages/index/index
  pageName = String(pageName).replace(/\\/g, '/'); // Compatible for windows

  // "getApp" is global injected
  let source = `var __renderFactory = ${requirePageTemplate};
    var __createPage = ${requireCreatePage};
    var Page = function(config) { Page.config = config; };
    ${content}
    require('@core/page').register({ page: ${JSON.stringify(pageName)} }, function(module, exports, require){
      module.exports = __createPage(Page.config, __renderFactory, require);
    });`;

  return source;
};

