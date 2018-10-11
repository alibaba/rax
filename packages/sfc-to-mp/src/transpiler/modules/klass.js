const getStaticProp = require('../getStaticProp');

function genData(el) {
  let data = '';
  if (el.staticClass || el.classBinding) {
    data += ` class="${getStaticProp(el.staticClass)}${el.classBinding ? ` {{${el.classBinding}}}` : ''}"`;
  }
  return data;
}

module.exports = {
  genData,
};


