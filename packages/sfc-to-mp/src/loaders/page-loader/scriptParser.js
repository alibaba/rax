const { promisify } = require('util');
const babel = require('babel-core');
const debug = require('debug')('mp:parse');

const componentParser = require('./componentParser');
const { parseComponentsDeps } = require('./parser');

/**
 * SFC <script /> contents parser run in webpack loader context
 * Return dependency SFC components node tree
 */
module.exports = function scriptParser(script) {
  const babelResult = babel.transform(script.content, {
    plugins: [parseComponentsDeps],
  });
  const { components: importedComponentsMap = {} } = babelResult.metadata;
  debug(importedComponentsMap);

  const resolvePromise = promisify(this.resolve);

  return Promise.all(
    Object.keys(importedComponentsMap).map((tagName) => {
      let modulePath = importedComponentsMap[tagName];
      return resolvePromise(this.context, modulePath).then(componentParser.bind(this));
    })
  );
};
