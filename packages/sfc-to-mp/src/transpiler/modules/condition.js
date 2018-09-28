const getTargetType = require('../../config/getTargetType');
const type = getTargetType();

const CONDITION_DIRECTIVES = {
  ali: {
    if: 'a:if',
    elif: 'a:elif',
    else: 'a:else',
  },
  wx: {
    if: 'wx:if',
    elif: 'wx:elif',
    else: 'wx:else',
  },
};
const directiveGroup = CONDITION_DIRECTIVES[type];

function genData(el, state) {
  const directives = [];
  if (el.if) {
    directives.push(`${directiveGroup.if}="{{${el.if}}}"`);
  } else if (el.elseif) {
    directives.push(`${directiveGroup.elif}="{{${el.elseif}}}"`);
  } else if (el.else) {
    directives.push(directiveGroup.else);
  }
  return directives.join(' ');
}

module.exports = {
  genData,
};
