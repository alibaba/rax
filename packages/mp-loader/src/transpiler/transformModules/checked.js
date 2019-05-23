const { getAndRemoveAttr, addAttr } = require('../helpers');

const BOOLEAN_ATTRS = ['checked', 'disabled', 'plain'];

function transformNode(el) {
  BOOLEAN_ATTRS.forEach((key) => {
    if (Object.hasOwnProperty.call(el.attrsMap, key)) {
      const exp = getAndRemoveAttr(el, key);

      /**
       * <tag checked />
       * exp will be ""
       * it means { checked: true }
       */
      addAttr(el, key, exp === '' ? 'true' : exp);
    }
  });
};

module.exports = {
  transformNode
};
