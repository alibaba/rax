const { isVDOMHelperFns, isSFCInternalIdentifier, VDOMHelpers, styleObjectName, componentDifinitionName, vdomHelperName, globalComponentsRefName } = require('../utils');
const withScope = require('./withScope');

module.exports = function(render, opts) {
  const { loaderContext, tagHelperMap, weexGlobalComponents, stringifyRequest } = opts;

  const isPreveredIdentifier = (key) => isVDOMHelperFns(key) && isSFCInternalIdentifier(key);
  const withScopeIdentifierDeclearation = withScope(render, isPreveredIdentifier);

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
    if (isWeex) Object.assign(__components_refs__, {
      ${globalComponentReqs}
    });` : '';

  return `function(${styleObjectName}, ${componentDifinitionName}, ${vdomHelperName}, isWeex) {
    ${VDOMHelpers.split(',').map((name) => `var ${name} = ${vdomHelperName}.${name};`).join('')}
    var ${globalComponentsRefName} = ${componentDifinitionName}.components;
    ${weexComponentsAdapter}
    return function() {
      ${withScopeIdentifierDeclearation}
      return ${render};
    };
  }`;
};
