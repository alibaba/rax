'use strict';

const css = require('css');
const transformer = require('./transformer');
const RULE = 'rule';

module.exports = function(source) {
  this.cacheable && this.cacheable();

  let callback = this.async();
  let stylesheet = css.parse(source).stylesheet;
  let data = {};

  if (stylesheet.parsingErrors.length) {
    throw new Error('StyleSheet Parsing Error occured.');
  }

  stylesheet.rules.forEach(function(rule) {
    let style = {};

    if (rule.type === RULE) {
      style = transformer.convert(rule);
    }

    rule.selectors.forEach(function(selector) {
      let sanitizedSelector = transformer.sanitizeSelector(selector);
      data[sanitizedSelector] = style;
    });
  });

  callback(null, 'module.exports = ' + JSON.stringify(data, undefined, '\t') + ';');
};
