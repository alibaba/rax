const getCompiledComponents = require('../getCompiledComponents');

/**
 * Judge whether node is native component
 * @param {Object} node
 * @param {string} platform
 */
module.exports = function isNativeComponent(node, platform) {
  // Compiled rax components and native base components are recognized as native components
  // If a component is not imported, then it is recognized as native base components (according to the tag isCustom in JSXOpeningElement node.name)
  return !!getCompiledComponents(platform)[node.name] || node && !node.isCustom;
};
