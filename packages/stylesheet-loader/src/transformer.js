'use strict';

import camelCase from 'camelCase';
import normalizeColor from './normalizeColor';
import particular from './particular';
import Validation from './Validation';

const COLOR_PROPERTIES = {
  color: true,
  backgroundColor: true,
  borderColor: true,
  borderBottomColor: true,
  borderTopColor: true,
  borderRightColor: true,
  borderLeftColor: true
};

export default {
  sanitizeSelector(selector, transformDescendantCombinator) {
    // filter multiple extend selectors
    if (!transformDescendantCombinator && !/^\.[a-zA-Z0-9_]+$/.test(selector)) {
      console.error(`\`${selector}\` is not a valid selector (valid e.g. ".abc、.abcBcd、.abc_bcd")`);
      return null;
    }
    return selector.replace(/\s/gi, '_').replace(/[\.]/g, '');
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
      result = Number(result);
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

      Validation.validate(camelCaseProperty, declaration.value);
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
