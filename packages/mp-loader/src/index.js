const { stringifyRequest, getOptions } = require('loader-utils');
const { join, relative } = require('path');
const { existsSync } = require('fs');
const { compileToES5, QueryString, createRequire, createRequireDefault, getPages } = require('./shared/utils');
const paths = require('./paths');

const pageLoaderPath = require.resolve('./page');
const STYLE_EXT = 'acss';
const EXTERNAL_PAGE_URL_REG = /^https?:\/\//;
/**
 * App loader
 * handle app.js for mini program
 */
module.exports = function (content) {
  const loaderOptions = getOptions(this) || {};
  const relativePath = relative(this.rootContext, this.resourcePath);
  const { resourcePath } = this;
  const stynaxType = global.TRANSPILER_TYPE = loaderOptions.type || 'ali';

  let globalStylePath = null;
  const appStylePath = join(
    this.resourcePath,
    `../app.${STYLE_EXT}`
  );

  if (existsSync(appStylePath)) {
    globalStylePath = appStylePath;
  }

  const regPagesCode = getPages(resourcePath)
    .filter((pagePath) => !EXTERNAL_PAGE_URL_REG.test(pagePath))
    .map((pagePath) => {
      const qs = new QueryString({
        globalStylePath,
        type: stynaxType,
      });
      const absPagePath = join(this.rootContext, pagePath);

      const req = stringifyRequest(
        this,
        `!!${pageLoaderPath}?${qs}!${absPagePath}`
      );
      return createRequire(req);
    })
    .join(';');

  const compiledSource = compileToES5(content, {
    sourceMaps: true,
    sourceFileName: relativePath,
  });

  const runtimeReq = createRequireDefault(stringifyRequest(this, paths.createApp));

  const source = `var App = ${runtimeReq};\n`
    + compiledSource.code + '\n' + regPagesCode;

  // skipping 1 line
  compiledSource.map.mappings = ';' + compiledSource.map.mappings;
  // `this.sourceMap` means whether sourceMap is enabled
  this.callback(null, source, this.sourceMap ? compiledSource.map : void 0);
};
