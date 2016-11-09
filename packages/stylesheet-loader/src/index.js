'use strict';

const css = require('css');
const transform = require('./transform');

let sanitizeSelector = transform.sanitizeSelector,
  convertTransform = transform.convertTransform,
  formatLessRenderError = transform.formatLessRenderError;

let RULE = 'rule';

module.exports = function(source) {
  this.cacheable && this.cacheable();
	let cb = this.async();

  let config = {
    filename: this.resource,
    paths: [],
    relativeUrls: true,
    compress: !!this.minimize
  };

  let stylesheet = css.parse(source).stylesheet;

  if (stylesheet.parsingErrors.length) {
    throw new Error('Parsing Error occured.');
  }

  stylesheet.rules.forEach(function(rule) {
    let style = {};

    if (rule.type === RULE) {
      style = transform.inheritText(rule);
    }

    rule.selectors.forEach(function(selector) {
      stylesheet[sanitizeSelector(selector)] = style;
    });
  });

  delete stylesheet.parsingErrors;
  delete stylesheet.rules;
  console.log(stylesheet);
  cb(null, 'module.exports = ' + JSON.stringify(stylesheet, undefined, '\t') + ';');
};
