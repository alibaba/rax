const { relative, extname } = require('path');
const { stringifyRequest, getOptions } = require('loader-utils');
const { compileES5, QueryString } = require('./shared/utils');
const parseSFC = require('./parser/page-sfc');
const paths = require('./paths');

const tplLoaderPath = require.resolve('./template');

module.exports = function(content) {
  const { type, globalStyle } = getOptions(this);
  const { resourcePath } = this;
  const relativePath = relative(this.rootContext, this.resourcePath);

  let regPageName = relativePath.slice(0, -extname(relativePath).length);
  regPageName = String(regPageName).replace(/\\/g, '/'); // for windows
  const pageInfo = JSON.stringify({
    path: regPageName
  });

  const { template, style, script } = parseSFC(resourcePath, {
    script: content,
    type
  });

  const { code: scriptContent, map } = compileES5(script.content, {
    sourceMaps: true,
    sourceFileName: relativePath,
  });

  const tplQueryString = new QueryString({
    type,
    globalStyle,
    stylePath: style ? style.path : 'null',
    isPage: true
  });
  const tplRequirement = stringifyRequest(this, `${tplLoaderPath}?${tplQueryString}!${template.path}`);
  const pageComponentFactory = `require(${stringifyRequest(this, paths.pageComponentFactory)}).default`;

  let source = ['var Page = function(config) { Page.config = config; }',
    `var getApp = require(${stringifyRequest(this, paths.getApp)}).default;`,
    `require('@core/page').register(${pageInfo}, function(module, exports, mpRequire){\n`, // 分离添加的代码和用户代码
    scriptContent,
    `\nmodule.exports = ${pageComponentFactory}(Page.config,require(${tplRequirement}),mpRequire);`,
    '});',
  ].join('');

  // sourceMap 往下滑行 3行, 因为上面加了一行 👆
  map.mappings = ';' + map.mappings;
  this.callback(null, source, this.sourceMap ? map : void 0);
};
