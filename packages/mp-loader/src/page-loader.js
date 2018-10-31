const { relative, extname } = require('path');
const querystring = require('querystring');
const { stringifyRequest, getOptions } = require('loader-utils');
const { createRequire } = require('./utils');
const runtimeHelpers = require('./runtimeHelpers');

const templateLoader = require.resolve('./template-loader');
const CSS_EXT = '.acss';
const TEMPLATE_EXT = '.axml';

module.exports = function(content) {
  const { appCssPath } = getOptions(this);
  const jsPath = this.resourcePath;
  const relativePath = relative(this.rootContext, jsPath);

  let cssPath = jsPath.replace('.js', CSS_EXT);
  let templatePath = jsPath.replace('.js', TEMPLATE_EXT);

  const templateLoaderQueryString = querystring.stringify({
    appCssPath,
    cssPath,
    isEntryTemplate: true
  });

  const requirePageTemplate = createRequire(stringifyRequest(this, `${templateLoader}?${templateLoaderQueryString}!${templatePath}`));
  const requireCreatePage = createRequire(stringifyRequest(this, runtimeHelpers.createPage));

  const extName = extname(relativePath);
  let pageName = relativePath.slice(0, - extName.length); // pages/index/index.js => pages/index/index
  pageName = String(pageName).replace(/\\/g, '/'); // Compatible for windows

  // "getApp" is global injected
  let source = `var Page = function(config){ Page.__config = config };
    ${content}
    require('@core/page').register({ page: ${JSON.stringify(pageName)} }, (function(__module, __exports, __require){
      __module.exports = ${requireCreatePage}(${requirePageTemplate}, __require, Page.__config);
    }));`;

  return source;
};
