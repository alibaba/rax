const { camelize, isDataset, isAriaProperty } = require('../helpers');

/**
 * Camelize passed props.
 *  <view foo-bar="val" />
 *   ->
 *  `props.fooBar`
 *  @NOTE dataset
 */
function transformNode(el) {
  if (Array.isArray(el.attrsList)) {
    for (let i = 0, l = el.attrsList.length; i < l; i++) {
      const attr = el.attrsList[i];
      if (!isDataset(attr.name) && !isAriaProperty(attr.name)) {
        attr.name = camelize(attr.name);
      }
    }
  }
}

module.exports = {
  transformNode,
};
