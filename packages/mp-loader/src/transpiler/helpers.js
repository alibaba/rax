const { cached } = require('../utils');
const { hasExpression, transformExpression } = require('./expression');

/**
 * Add an attr to element.
 * @param el
 * @param name
 * @param value
 * @param scope
 */
function addAttr(el, name, value, scope = 'this.data') {
  (el.attrs || (el.attrs = [])).push({
    name,
    value,
    scope
  });
}

/**
 * Get and remove an attr from element.
 * @param el {Element} Element.
 * @param name {String} Name of attr.
 * @return {*}
 */
function getAndRemoveAttr(el, name) {
  let val;
  if ((val = el.attrsMap[name]) != null) {
    const list = el.attrsList;
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break;
      }
    }
  }
  return normalizeMustache(val, el);
}


/**
 * Pluck mustache template to ES expression.
 * @param exp
 * @param el
 * @return {*}
 */
function normalizeMustache(exp, el) {
  /**
   * It's so strange that wx/ali
   * support both {{ a: 1 }} or {{ data }}
   * shouldn't it be {{{ a: 1 }}} and {{ data }} ?
   */
  let result = exp;
  if (exp && hasExpression(exp)) {
    const isInScope = isInFor(el);
    result = transformExpression(exp, undefined, {
      scope: isInScope ? '' : 'data'
    });
  }
  return result;
}

/**
 * Get the root of one element.
 * @param el {Element}  Some element.
 * @return {Element} Root element.
 */
function getRootEl(el) {
  if (!el.parent) {
    return el;
  } else {
    return getRootEl(el.parent);
  }
};

/**
 * Check an element is in for loop.
 * @param el {Element} Element.
 * @return {Boolean} Is in for loop.
 */
function isInFor(el) {
  if (el.parent) {
    return !!el.for || isInFor(el.parent);
  } else {
    return !!el.for;
  }
}

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
const camelize = cached(function(str) {
  return str.replace(camelizeRE, function(_, c) {
    return c ? c.toUpperCase() : '';
  });
});

/**
 * Detect whether name is a dataset.
 */
const DATASET_REG = /^data-/;
const isDataset = cached(function(name) {
  return DATASET_REG.test(name);
});

/**
 * Detect whether name is an aria property.
 */
const ARIA_REG = /^aria-/;
const isAriaProperty = cached(function(name) {
  return ARIA_REG.test(name);
});

/**
 * Detect whether name is need to transform
 */
function isPreservedPropName(name) {
  return isDataset(name) || isAriaProperty(name);
}

exports.addAttr = addAttr;
exports.getRootEl = getRootEl;
exports.getAndRemoveAttr = getAndRemoveAttr;
exports.normalizeMustache = normalizeMustache;
exports.isPreservedPropName = isPreservedPropName;
exports.camelize = camelize;
