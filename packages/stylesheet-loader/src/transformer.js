'use strict';

const camelCase = require('camelcase');
const normalizeColor = require('./normalizeColor');
const particular = require('./particular');

const COLOR_PROPERTIES = {
  color: true,
  backgroundColor: true,
  borderColor: true,
  borderBottomColor: true,
  borderTopColor: true,
  borderRightColor: true,
  borderLeftColor: true
};

module.exports = {
  sanitizeSelector(selector, camelcase) {
    let _selector = selector.replace(/\s/gi, '_').replace(/[\.#]/g, '');

    if (camelcase) {
      _selector = camelCase(selector);
    }

    return _selector;
  },

  convertProp(prop) {
    let result = camelCase(prop);

    // Handle vendor prefixes
    if (prop.indexOf('-webkit') === 0) {
      result = result.replace('webkit', 'Webkit');
    } else if (prop.indexOf('-moz') === 0) {
      result = result.replace('moz', 'Moz');
    }

    return result;
  },

  convertValue(property, value) {
    var result = value,
      resultNumber;

    if (!Number.isNaN(Number(result))) {
      resultNumber = Number(result);
    }

    // Handle single pixel values (font-size: 16px)
    if (result.indexOf(' ') === -1 && result.indexOf('px') !== -1) {
      result = parseInt(result.replace('px', ''), 10);
    } else if (typeof resultNumber === 'number') {
      result = resultNumber;
    }

    if (COLOR_PROPERTIES[property]) {
      result = normalizeColor(value);
    }

    return result;
  },

  convert(rule) {
    let style = {};

    if (rule.tagName === 'text') {
      return;
    }

    rule.declarations.forEach((declaration) => {
      let camelCaseProperty = this.convertProp(declaration.property);
      let value = this.convertValue(camelCaseProperty, declaration.value);
      style[camelCaseProperty] = value;

      if (particular[camelCaseProperty]) {
        let particularResult = particular[camelCaseProperty](value);
        if (particularResult.isDeleted) {
          style[camelCaseProperty] = null;
          delete style[camelCaseProperty];
          delete particularResult.isDeleted;
        }
        Object.assign(style, particularResult);
      }
    });

    return style;
  }
};
