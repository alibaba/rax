const { declearTags } = require('../declear');
const { uniqueInstanceID, makeMap } = require('sfc-shared-utils');
const injectThisScope = require('./injectThisScope');

// helpers
const declarationName = `$_${uniqueInstanceID}_declaration`;
const helpersFns = '_c,_o,_n,_s,_l,_t,_q,_i,_m,_f,_k,_b,_v,_e,_u,_g,_cx';

module.exports = function (render, tagHelperMap) {
  const declearedTags = declearTags(tagHelperMap, '$t');
  const existRenderHelpers = makeMap(
    helpersFns + ',' + Object.values(tagHelperMap).join(',')
  );
  const thisDefines = injectThisScope(render, existRenderHelpers);

  return `function(_st,_d,{${helpersFns}}) {
    return function() {
      var $t = _d.components || {};
      ${declearedTags}
      ${thisDefines}
      return ${render};
    };
  }`;
};
