const { relative, extname, join } = require('path');
const { existsSync, readFileSync } = require('fs');
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

  const dependencyComponents = {};
  const configPath = this.resourcePath.replace(/\.js$/, '.json');
  if (existsSync(configPath)) {
    const pageConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
    if (pageConfig.usingComponents) {
      for (let componentName in pageConfig.usingComponents) {
        if (pageConfig.usingComponents.hasOwnProperty(componentName)) {
          dependencyComponents[componentName] = join(this.rootContext, pageConfig.usingComponents[componentName]);
        }
      }
    }
  }

  const tplQueryString = new QueryString({
    type,
    globalStylePath,
    stylePath: style ? style.path : 'null',
    isPage: true,
    dependencyComponents: JSON.stringify(dependencyComponents),
  });
  const regTemplateReq = createRequire(stringifyRequest(this, `${tplLoaderPath}?${tplQueryString}!${template.path}`));
  const createPageReq = createRequireDefault(stringifyRequest(this, paths.createPage));

  let source =
    `var Page = function(config) { Page.config = config; };
    require('@core/page').register(${pageInfo}, function(module, exports, getCoreModule){
${scriptContent}
      module.exports = ${createPageReq}(Page.config, ${regTemplateReq}, getCoreModule);
    });`;

  // code above add 2 lines to user wrote codes
  scriptSourceMap.mappings = ';;' + scriptSourceMap.mappings;
  this.callback(null, source, this.sourceMap ? scriptSourceMap : void 0);
};
