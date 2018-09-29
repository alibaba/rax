/**
 * script 脚本解析器
 * 分析当前文件内的文件内容，以及依赖的文件内容
 *
 * 返回的格式是
 *
 * {
 *   path: .js
 *   contents: 'hello',
 *   children: [{path, contents}]
 * }
 */

const { join, parse, resolve, dirname, extname } = require('path');
const babel = require('babel-core');

const genTemplateName = require('./genTemplateName');
const genTemplate = require('./genTemplate');
const { parseComponentsDeps } = require('./parser');
const getExt = require('../../config/getExt');
const { OUTPUT_SOURCE_FOLDER } = require('../../config/CONSTANTS');

module.exports = (script, { resourcePath, pageName }) => {
  const templateExt = getExt('template');
  const imports = {};
  const dependencies = [];

  const babelResult = babel.transform(script.content, {
    plugins: [parseComponentsDeps],
  });
  const { components: importedComponentsMap } = babelResult.metadata;

  let scriptReferencePath;
  let result = {};
  Object.keys(importedComponentsMap || {}).forEach(tagName => {
    let modulePath = importedComponentsMap[tagName];
    const { name } = parse(modulePath);

    let vueModulePath = resolve(dirname(resourcePath), modulePath);
    const tplName = genTemplateName(vueModulePath);
    const tplPath = join(
      OUTPUT_SOURCE_FOLDER,
      'components',
      modulePath
    );
    const tplPath2 = join(
      OUTPUT_SOURCE_FOLDER,
      'components',
      genTemplateName(modulePath)
    );

    /**
     * name: 模块名称, name="title"
     * tplName: vmp 生成的唯一名称, 用于 import 和生成 axml
     */
    imports[tagName] = {
      tagName,
      tplName,
      filename: name,
      configPath: tplPath,
    };

    const p =
      extname(vueModulePath) === '.html'
        ? vueModulePath
        : vueModulePath + '.html';

    result = genTemplate({
      path: p,
      pageName,
      modulePath,
      tplName,
      name,
    });

    scriptReferencePath = tplPath2 + templateExt;
    dependencies.push(`<import src="/${scriptReferencePath}" />`);
  });

  return {
    originPath: result.originPath,
    path: scriptReferencePath,
    contents: result.contents,
    children: result.files,
    imports,
    dependencies,
  };
};
