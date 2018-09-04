const { isVDOMHelperFns, isSFCInternalIdentifier } = require('../utils');
const withScope = require('./withScope');

module.exports = function(render, opts) {
  const { loaderContext, tagHelperMap, weexGlobalComponents, stringifyRequest } = opts;

  const isPreveredIdentifier = (key) => isVDOMHelperFns(key) && isSFCInternalIdentifier(key);
  const thisDefines = withScope(render, isPreveredIdentifier);

  /**
   * driver weex components
   */
  let globalComponentReqs = '';
  if (weexGlobalComponents) {
    const componentList = Object.keys(weexGlobalComponents);
    let moduleName;
    Object.keys(tagHelperMap || {}).forEach((usageTag) => {
      if (moduleName = weexGlobalComponents[usageTag]) {
        globalComponentReqs += `'${usageTag}': require(` + stringifyRequest(loaderContext, moduleName) + '),';
      }
    });
  }

  const weexComponentsAdapter = weexGlobalComponents ? `
    if (isWeex) {
      __components_refs__ = Object.assign({
        ${globalComponentReqs}
      }, __components_refs__);
    }` : '';

  return `function(_st,_d,{${helpersFns}}, isWeex) {
    var __components_refs__ = _d.components;
    ${weexComponentsAdapter}
    return function() {
      ${thisDefines}
      return ${render};
    };
  }`;
};
