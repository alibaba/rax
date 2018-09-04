const { makeMap, objectValues } = require('../utils');
const injectThisScope = require('./injectThisScope');

// helpers
const declarationName = `__sfc_module_declaration__`;
const helpersFns = '_c,_o,_n,_s,_l,_t,_q,_i,_m,_f,_k,_b,_v,_e,_u,_g,_cx';

module.exports = function(render, opts) {
  const { loaderContext, tagHelperMap, weexGlobalComponents, stringifyRequest } = opts;

  const existRenderHelpers = makeMap(
    helpersFns + ',__components_refs__'
  );
  const thisDefines = injectThisScope(render, existRenderHelpers);

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
