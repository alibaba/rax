'use strict';

const css = require('css');
const transformer = require('./transformer');
const loaderUtils = require('loader-utils');
const RULE = 'rule';

module.exports = function(source) {
  this.cacheable && this.cacheable();

  let query = loaderUtils.parseQuery(this.query);
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
      let sanitizedSelector = transformer.sanitizeSelector(selector, query.camelcase);
      data[sanitizedSelector] = style;
    });
  });

  callback(null, 'module.exports = ' + JSON.stringify(data, undefined, '  ') + ';');
};
