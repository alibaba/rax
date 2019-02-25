const { relative, extname } = require('path');
const { existsSync, readFileSync } = require('fs');
const querystring = require('querystring');
const { stringifyRequest, getOptions } = require('loader-utils');
const { createRequire, error } = require('./utils');
const runtimeHelpers = require('./runtimeHelpers');
const resolveDependencyComponents = require('./component-resolver');

const templateLoader = require.resolve('./template-loader');
const JS_EXT = '.js';
const CSS_EXT = '.acss';
const TEMPLATE_EXT = '.axml';
const CONFIG_EXT = '.json';
const PAGE_REGISTER = 'require(\'@core/page\').register';

module.exports = function(content) {
  const options = getOptions(this) || {};
  const appCssPath = options.appCssPath;
  const pageRegister = options.pageRegister || PAGE_REGISTER;
  const jsPath = this.resourcePath;
  const relativePath = relative(this.rootContext, jsPath);

  let basePath = jsPath.replace(JS_EXT, '');
  let cssPath = basePath + CSS_EXT;
  let templatePath = basePath + TEMPLATE_EXT;
  let configPath = basePath + CONFIG_EXT;

  let config = {};
  this.addDependency(configPath);
  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch (err) {
      const relativeConfigPath = relativePath.replace(JS_EXT, CONFIG_EXT);
      error(`Can not parse ${relativeConfigPath}, please check the page config is a valid JSON.`);
    }
  }

  const dependencyComponents = resolveDependencyComponents(config, this.rootContext, basePath);
  const templateLoaderQueryString = querystring.stringify({
    isEntryTemplate: true,
    dependencyComponents: JSON.stringify(dependencyComponents),
  });

  const requirePageTemplate = createRequire(stringifyRequest(this, `${templateLoader}?${templateLoaderQueryString}!${templatePath}`));
  const requireCreatePage = createRequire(stringifyRequest(this, runtimeHelpers.createPage));

  const extName = extname(relativePath);
  let pageName = relativePath.slice(0, - extName.length); // pages/index/index.js => pages/index/index
  pageName = String(pageName).replace(/\\/g, '/'); // Compatible for windows

  const pageDescriptor = options.pageDescriptor || { page: pageName };
  let cssRequirements = [];
  if (existsSync(appCssPath)) {
    cssRequirements.push(createRequire(stringifyRequest(this, appCssPath)));
  }
  if (existsSync(cssPath)) {
    cssRequirements.push(createRequire(stringifyRequest(this, cssPath)));
  }

  // "getApp" is global injected
  let source = `var Page = function(config) { Page.__config = config; };
    ${content}
    ${pageRegister}(${JSON.stringify(pageDescriptor)}, function(__module, __exports, __require){
      __module.exports = ${requireCreatePage}(
        ${requirePageTemplate}, 
        __require, 
        Page.__config,
        [${cssRequirements.join(',')}]
      );
    });`;

  return source;
};

