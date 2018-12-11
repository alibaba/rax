const { camelize, isPreservedPropName } = require('../helpers');

/**
 * Camelize passed props.
 *  <view foo-bar="val" />
 *   ->
 *  `props.fooBar`
 *  @NOTE data-* and aria-* is ignored to camlize.
 */
function transformNode(el) {
  if (Array.isArray(el.attrsList)) {
    for (let i = 0, l = el.attrsList.length; i < l; i++) {
      const attr = el.attrsList[i];
      if (isPreservedPropName(attr.name)) {
        attr.name = camelize(attr.name);
      }
    }
  }
}

module.exports = {
  transformNode,
};
