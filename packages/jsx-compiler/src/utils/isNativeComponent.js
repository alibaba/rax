const getCompiledComponents = require('../getCompiledComponents');

module.exports = function isNativeComponent(path, platform) {
  const {
    node: { name: tagName }
  } = path.parentPath.get('name');
  return !!getCompiledComponents(platform)[tagName];
};
