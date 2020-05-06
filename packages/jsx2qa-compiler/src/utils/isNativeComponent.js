const getCompiledComponents = require('../getCompiledComponents');

module.exports = function isNativeComponent(path) {
  const {
    node: { name: tagName }
  } = path.parentPath.get('name');
  return !!getCompiledComponents[tagName];
};
