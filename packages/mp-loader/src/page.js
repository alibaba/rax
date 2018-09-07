const { relative, extname } = require('path');
const { stringifyRequest, getOptions } = require('loader-utils');
const { compileToES5, QueryString, createRequire, createRequireDefault } = require('./shared/utils');
const parseSFC = require('./parser/page-sfc');
const paths = require('./paths');

const tplLoaderPath = require.resolve('./template');

module.exports = function(content) {
  const { type, globalStylePath } = getOptions(this);
  const { resourcePath } = this;
  const relativePath = relative(this.rootContext, this.resourcePath);

  let regPageName = relativePath.slice(0, -extname(relativePath).length);
  regPageName = String(regPageName).replace(/\\/g, '/'); // compatible for windows
  const pageInfo = JSON.stringify({
    page: regPageName,
  });

  const { template, style, script } = parseSFC(resourcePath, {
    script: content,
    type
  });

  const { code: scriptContent, map: scriptSourceMap } = compileToES5(script.content, {
    sourceMaps: true,
    sourceFileName: relativePath,
  });

  const tplQueryString = new QueryString({
    type,
    globalStylePath,
    stylePath: style ? style.path : 'null',
    isPage: true
  });
  const regTemplateReq = createRequire(stringifyRequest(this, `${tplLoaderPath}?${tplQueryString}!${template.path}`));
  const createPageReq = createRequireDefault(stringifyRequest(this, paths.createPage));
  const getAppReq = createRequireDefault(stringifyRequest(this, paths.getApp));

  let source =
    `var Page = function(config) { Page.config = config; }
    var getApp = ${getAppReq};
    require('@core/page').register(${pageInfo}, function(module, exports, getCoreModule){
${scriptContent}
      module.exports = ${createPageReq}(Page.config, ${regTemplateReq}, getCoreModule);
    });`;

  // code above add three lines to user wrote codes
  scriptSourceMap.mappings = ';;;' + scriptSourceMap.mappings;
  this.callback(null, source, this.sourceMap ? scriptSourceMap : void 0);
};
