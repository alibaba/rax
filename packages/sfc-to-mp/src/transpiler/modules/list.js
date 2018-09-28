const getTargetType = require('../../config/getTargetType');

const type = getTargetType();

const LIST_DIRECTIVES = {
  ali: {
    for: 'a:for',
    forItem: 'a:for-item',
    forIndex: 'a:for-index',
  },
  wx: {
    for: 'wx:for',
    forItem: 'wx:for-item',
    forIndex: 'wx:for-index',
  },
};
const directiveGroup = LIST_DIRECTIVES[type];

function genData(el) {
  const directives = [];
  if (el.for) {
    directives.push(`${directiveGroup.for}="{{${el.for}}}"`);
    if (el.alias) {
      directives.push(`${directiveGroup.forItem}="${el.alias}"`);
    }
    if (el.iterator1) {
      directives.push(`${directiveGroup.forIndex}="${el.iterator1}"`);
    }
  }
  return directives.join(' ');
}

module.exports = {
  genData,
};
