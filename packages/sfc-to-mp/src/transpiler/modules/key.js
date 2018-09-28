const getTargetType = require('../../config/getTargetType');
const type = getTargetType();

const KEY_DIRECTIVES = {
  ali: 'a:key',
  wx: 'wx:key',
};
const propKey = KEY_DIRECTIVES[type];

function genData(el, state) {
  let data = '';
  if (el.key) {
    data = propKey + '="{{' + el.key + '}}"';
  }
  return data;
}

module.exports = {
  genData,
};
