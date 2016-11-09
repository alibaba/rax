'use strict';

const css = require('css');
const transform = require('./transform');

let sanitizeSelector = transform.sanitizeSelector;

let RULE = 'rule';

module.exports = function(source) {
  this.cacheable && this.cacheable();
  let cb = this.async();

  let stylesheet = css.parse(source).stylesheet,
    data = {};

  if (stylesheet.parsingErrors.length) {
    throw new Error('Parsing Error occured.');
  }

  stylesheet.rules.forEach(function(rule) {
    let style = {};

    if (rule.type === RULE) {
      style = transform.inheritText(rule);
    }

    rule.selectors.forEach(function(selector) {
      data[sanitizeSelector(selector)] = style;
    });
  });

  cb(null, 'module.exports = ' + JSON.stringify(data, undefined, '\t') + ';');
};
