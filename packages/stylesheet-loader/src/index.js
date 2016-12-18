'use strict';

import css from 'css';
import transformer from './transformer';
import loaderUtils from 'loader-utils';
const RULE = 'rule';

module.exports = function(source) {
  this.cacheable && this.cacheable();

  const callback = this.async();
  const stylesheet = css.parse(source).stylesheet;
  const query = loaderUtils.parseQuery(this.query);
  const transformDescendantCombinator = query.transformDescendantCombinator;
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
      let sanitizedSelector = transformer.sanitizeSelector(selector, transformDescendantCombinator);
      if (sanitizedSelector) {
        data[sanitizedSelector] = Object.assign(data[sanitizedSelector] || {}, style);
      }
    });
  });

  callback(null, 'module.exports = ' + JSON.stringify(data, undefined, '  ') + ';');
};
