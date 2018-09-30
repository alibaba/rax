/**
 * 分析当前页面 SFC 中的依赖文件
 * 并解析出模板文件中的组件依赖与标签映射关系
 *
 * @return object
 * @example
 *
    { 'sfc-title':
      { tagName: 'sfc-title',
        templateName: 'title$4a18c350',
        fileName: 'title',
        filePath: '/Users/noyobo/iceworks-workspace/example/components/title.html',
        outputPath: '/Users/noyobo/iceworks-workspace/example/sources/components/title.html' }
    }
 */

const { promisify } = require('util');
const babel = require('babel-core');
const debug = require('debug')('mp:deps');
const path = require('path');

const genTemplateName = require('./genTemplateName');
const { parseComponentsDeps } = require('./parser');
const { OUTPUT_SOURCE_FOLDER } = require('../../config/CONSTANTS');

module.exports = function(script) {
  const babelResult = babel.transform(script.content, {
    plugins: [parseComponentsDeps],
  });
  const { components: importedComponentsMap = {} } = babelResult.metadata;

  const resolvePromise = promisify(this.resolve);

  return Promise.all(
    Object.keys(importedComponentsMap).map(tagName => {
      return new Promise(resolve => {
        let modulePath = importedComponentsMap[tagName];
        resolvePromise(path.dirname(this.resourcePath), modulePath).then(
          sfcModuleAbsolute => {
            const templateName = genTemplateName(sfcModuleAbsolute);
            const { name } = path.parse(sfcModuleAbsolute);
            resolve({
              tagName, // 标签名
              templateName, // unique template name
              fileName: name,
              filePath: sfcModuleAbsolute, // source file path
              outputPath: path.join(
                // transform when output path
                this.rootContext,
                OUTPUT_SOURCE_FOLDER,
                path.relative(this.rootContext, sfcModuleAbsolute)
              ),
            });
          }
        );
      });
    })
  ).then(dependencies => {
    const dependenciesMap = {};
    dependencies.forEach(dep => {
      dependenciesMap[dep.tagName] = dep;
    });
    debug(dependenciesMap);
    return dependenciesMap;
  });
};
