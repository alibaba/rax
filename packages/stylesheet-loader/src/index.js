'use strict';

import css from 'css';
import transformer from './transformer';
import loaderUtils from 'loader-utils';
import {getErrorMessages, getWarnMessages} from './promptMessage';

const RULE = 'rule';
const FONT_FACE_RULE = 'font-face';
const QUOTES_REG = /['|"]/g;

module.exports = function(source) {
  this.cacheable && this.cacheable();

  const stylesheet = css.parse(source).stylesheet;
  const query = loaderUtils.parseQuery(this.query);
  const transformDescendantCombinator = query.transformDescendantCombinator;
  let data = {};
  let fontFontRules = [];

  if (stylesheet.parsingErrors.length) {
    throw new Error('StyleSheet Parsing Error occured.');
  }

  stylesheet.rules.forEach(function(rule) {
    let style = {};

    if (rule.type === RULE) {
      style = transformer.convert(rule);

      rule.selectors.forEach((selector) => {
        let sanitizedSelector = transformer.sanitizeSelector(selector, transformDescendantCombinator);
        if (sanitizedSelector) {
          data[sanitizedSelector] = Object.assign(data[sanitizedSelector] || {}, style);
        }
      });
    }

    if (rule.type === FONT_FACE_RULE) {
      let font = {};
      rule.declarations.forEach((declaration) => {
        font[declaration.property] = declaration.value;
      });
      fontFontRules.push(font);
    }
  });

  return exportContent(data, getFontFaceContent(fontFontRules));
};

const exportContent = (data, fontFaceContent) => {
  return `
    ${fontFaceContent}

    if (process.env.NODE_ENV !== 'production') {
      console.error('${getErrorMessages()}');
      console.warn('${getWarnMessages()}');
    }
    module.exports = ${JSON.stringify(data, undefined, '  ')};
  `;
};

const getFontFaceContent = (rules) => {
  let content = '';

  rules.forEach((rule, index) => {
    content += `
      var font${index} = new FontFace('${rule['font-family'].replace(QUOTES_REG, '')}', '${rule.src.replace(QUOTES_REG, '')}');
      document.fonts.add(font${index});
    `;
  });
  return content;
};
