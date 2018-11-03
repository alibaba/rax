const { getOption } = require('../../config/cliOptions');

const targetType = getOption('target');
const KEY_DIRECTIVES = {
  ali: 'a:key',
  wx: 'wx:key',
};
const propKey = KEY_DIRECTIVES[targetType];

function genData(el) {
  let data = '';
  if (el.key) {
    data = propKey + '="{{' + el.key + '}}"';
  }
  return data;
}

module.exports = {
  genData,
};
