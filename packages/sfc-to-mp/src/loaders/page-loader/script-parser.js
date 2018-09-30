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

const babel = require('babel-core');
const debug = require('debug')('mp:parse');
const { promisify } = require('util');

const genTemplate = require('./genTemplate');
const { parseComponentsDeps } = require('./parser');

module.exports = function(script, { pageName }) {
  const babelResult = babel.transform(script.content, {
    plugins: [parseComponentsDeps],
  });
  const { components: importedComponentsMap = {} } = babelResult.metadata;
  debug(importedComponentsMap);

  const resolvePromise = promisify(this.resolve);

  return Promise.all(
    Object.keys(importedComponentsMap).map((tagName) => {
      let modulePath = importedComponentsMap[tagName];
      return resolvePromise(this.context, modulePath).then((importedComponentAbsolute) => {
        // 解析所有依赖得到组件依赖树
        return genTemplate({ path: importedComponentAbsolute, pageName, modulePath }, this);
      });
    })
  );
};
