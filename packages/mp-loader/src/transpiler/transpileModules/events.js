const { normalizeMustache } = require('../helpers');

const EVENT_MAPPING = {
  tap: 'click'
};
const EVENT_REG = /^on[A-Z]/;
const DATA_SCOPE_REG = /^data[.[]/;

/**
 * transpile bindXxx to onXxxx
 * @param {*} node
 */
function transformNode(node) {
  const { attrsMap, attrsList } = node;
  if (!Array.isArray(attrsList)) {
    return;
  }
  const events = {};
  const toSplice = [];

  for (let i = 0, l = attrsList.length; i < l; i++) {
    let { name, value } = attrsList[i];
    value = normalizeMustache(value, node);
    if (EVENT_REG.test(name)) {
      const rawEvtName = name.slice(2).toLowerCase();
      const evtName = EVENT_MAPPING[rawEvtName] || rawEvtName;
      toSplice.push(i);
      // gen handler
      const isValFromData = DATA_SCOPE_REG.test(value);
      /**
       * this or data are 2 scope variable origin
       *
       * onClick: data['xxx'] -> original
       * onClick: fooo -> this.fooo
       */
      events[evtName] = { value, scope: isValFromData ? '' : 'this.' };
    }
  }

  toSplice.reverse().forEach(i => {
    splice(attrsList, i);
  });
  node.events = events;
}

function splice(arr, i) {
  arr.splice(i, 1);
}

module.exports = {
  transformNode
};
