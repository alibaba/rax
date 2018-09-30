const { parse } = require('path');
const hash = require('hash-sum');

module.exports = function getTemplateName(p) {
  const { name } = parse(p);
  return `${name}$${hash(p)}`;
};
