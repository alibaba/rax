const getCompiledComponents = require('../getCompiledComponents');

module.exports = function isNativeComponent(path, platform, imported) {
  const {
    node: { name: tagName }
  } = path.parentPath.get('name');

  // Compiled rax components and native base components are recognized as native components
  // If a component is not imported, then it is recognized as native base components
  return !!getCompiledComponents(platform)[tagName] || (imported && !imported[tagName]);
};
