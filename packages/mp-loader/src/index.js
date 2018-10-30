const { stringifyRequest, getOptions } = require('loader-utils');
const { join, relative } = require('path');
const { existsSync } = require('fs');
const querystring = require('querystring');
const { createRequire } = require('./utils');
const runtimeHelpers = require('./runtimeHelpers');

const pageLoader = require.resolve('./page-loader');
const CSS_EXT = '.acss';
const JS_EXT = '.js';
const EXTERNAL_PAGE_URL_REG = /^https?:\/\//;

/**
 * App loader
 * handle app.js for mini program
 */
module.exports = function(content) {
  const jsPath = this.resourcePath;
  let cssPath = jsPath.replace(JS_EXT, CSS_EXT);
  const relativePath = relative(this.rootContext, jsPath);

  if (!existsSync(cssPath)) {
    cssPath = null;
  }

  let source = content;

  if (relativePath === 'app.js') {
    const appJson = require(jsPath.replace(JS_EXT, '.json'));
    const appJsonPages = appJson.pages || [];

    const requireAppPages = appJsonPages.filter((pagePath) => !EXTERNAL_PAGE_URL_REG.test(pagePath))
      .map((pagePath) => {
        const qs = querystring.stringify({
          appCssPath: cssPath
        });
        const absPagePath = join(this.rootContext, pagePath);
        return createRequire(stringifyRequest(this, `${pageLoader}?${qs}!${absPagePath}`));
      }).join(';');

    const requireCreateApp = createRequire(stringifyRequest(this, runtimeHelpers.createApp));
    // Alias createApp to App
    source = `var App = ${requireCreateApp};
      ${content}
      ${requireAppPages}`;
  }

  return source;
};
