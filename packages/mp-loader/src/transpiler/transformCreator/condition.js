const { getAndRemoveAttr } = require('../helpers');

function createTransformNode(attributes) {
  return function(el, options) {
    const { attrsMap, attrsList } = el || {};
    if (!Array.isArray(attrsList)) {
      return;
    }

    const exp = getAndRemoveAttr(el, attributes.IF);
    if (exp) {
      el.if = exp;
      addIfCondition(el, {
        exp: exp,
        block: el
      });
    } else {
      if (getAndRemoveAttr(el, attributes.ELSE) != null) {
        el.else = true;
      }
      const elseif = getAndRemoveAttr(el, attributes.ELSE_IF);
      if (elseif) {
        el.elseif = elseif;
      }
    }
  };

  function addIfCondition(el, condition) {
    if (!el.ifConditions) {
      el.ifConditions = [];
    }
    el.ifConditions.push(condition);
  }
}

module.exports = {
  createTransformNode
};
