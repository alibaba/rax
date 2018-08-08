const { stringifyRequest, getOptions } = require('loader-utils');
const { resolve, join, basename, relative } = require('path');
const { existsSync } = require('fs');
const { compileES5, QueryString } = require('../shared/utils');
const paths = require('../paths');

const pageLoaderPath = require.resolve('./page');

function getPages(resourcePath) {
  const appJSONPath = join(resourcePath, '../app.json');
  const appJSON = require(appJSONPath);
  return appJSON.pages || [];
}

/**
 * App loader
 * handle app.js for mini program
 */
module.exports = function (content) {
  const loaderOptions = getOptions(this);
  const relativePath = relative(this.rootContext, this.resourcePath);
  let { type } = loaderOptions || {};
  const { resourcePath } = this;

  type = type || 'my'; // wx or my, weixin | alipay
  global.TRANSPILER_TYPE = type;


  let globalStyle = null;
  const appStylePath = join(
    this.resourcePath,
    `../app.${type === 'wx' ? 'wxss' : 'acss'}`
  );
  if (existsSync(appStylePath)) {
    globalStyle = appStylePath;
  }

  const registerPages = getPages(resourcePath)
    .map((pagePath) => {
      const qs = new QueryString({
        globalStyle,
        type,
      });
      const absPagePath = join(this.rootContext, pagePath);

      const req = stringifyRequest(
        this,
        `!!${pageLoaderPath}?${qs}!${absPagePath}`
      );
      return `require(${req});`;
    })
    .join('');

  const { code, map } = compileES5(content, {
    sourceMap: true,
    sourceFileName: relativePath,
  });

  const source = `;(function (App,$PAGE_REG,my){
${code}
${registerPages}
  })(
    require(${stringifyRequest(this, paths.App)}).default,
    require(${stringifyRequest(this, paths.Page)}).default,
    require(${stringifyRequest(this, paths.createAPI)})({ currentPath: '/' })
  );`;

  // 往下滑行一行, 因为上面加了一行 👆
  map.mappings = ';' + map.mappings;
  this.callback(null, source, this.sourceMap ? map : void 0);
};
