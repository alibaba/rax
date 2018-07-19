const type = global.TRANSPILER_TYPE || 'my';

const ATTRIBUTES = {
  wx: {
    IF: 'wx:if',
    ELSE_IF: 'wx:elif',
    ELSE: 'wx:else'
  },
  my: {
    IF: 'a:if',
    ELSE_IF: 'a:elif',
    ELSE: 'a:else'
  }
};

const { getAndRemoveAttr } = require('../helpers');

function transformNode(el, options) {
  const { attrsMap, attrsList } = el || {};
  if (!Array.isArray(attrsList)) {
    return;
  }

  const exp = getAndRemoveAttr(el, ATTRIBUTES[type].IF);
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, ATTRIBUTES[type].ELSE) != null) {
      el.else = true;
    }
    const elseif = getAndRemoveAttr(el, ATTRIBUTES[type].ELSE_IF);
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function addIfCondition(el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

module.exports = {
  // staticKeys: ['className', 'style'],
  transformNode
  // genData
};
