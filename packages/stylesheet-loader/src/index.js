'use strict';

import css from 'css';
import transformer from './transformer';
import loaderUtils from 'loader-utils';
import { getErrorMessages, getWarnMessages, resetMessage } from './promptMessage';

const RULE = 'rule';
const FONT_FACE_RULE = 'font-face';
const MEDIA_RULE = 'media';
const QUOTES_REG = /['|"]/g;

module.exports = function(source) {
  this.cacheable && this.cacheable();

  const stylesheet = css.parse(source).stylesheet;

  if (stylesheet.parsingErrors.length) {
    throw new Error('StyleSheet Parsing Error occured.');
  }

  // getOptions can return null if no query passed.
  const parsedQuery = loaderUtils.getOptions(this) || {};

  // Compatible with string true.
  if (parsedQuery.log === 'true') {
    parsedQuery.log = true;
  }

  const parsedData = parse(parsedQuery, stylesheet);

  return genStyleContent(parsedData, parsedQuery);
};

const parse = (parsedQuery, stylesheet) => {
  let styles = {};
  let fontFaceRules = [];
  let mediaRules = [];
  const transformDescendantCombinator = parsedQuery.transformDescendantCombinator;

  stylesheet.rules.forEach(function(rule) {
    let style = {};

    // normal rule
    if (rule.type === RULE) {
      style = transformer.convert(rule, parsedQuery.log);

      rule.selectors.forEach((selector) => {
        let sanitizedSelector = transformer.sanitizeSelector(selector, transformDescendantCombinator, rule.position, parsedQuery.log);

        if (sanitizedSelector) {
          // handle pseudo class
          const pseudoIndex = sanitizedSelector.indexOf(':');
          if (pseudoIndex > -1) {
            let pseudoStyle = {};
            const pseudoName = selector.slice(pseudoIndex + 1);
            sanitizedSelector = sanitizedSelector.slice(0, pseudoIndex);

            Object.keys(style).forEach((prop) => {
              pseudoStyle[prop + pseudoName] = style[prop];
            });

            style = pseudoStyle;
          }

          styles[sanitizedSelector] = Object.assign(styles[sanitizedSelector] || {}, style);
        }
      });
    }

    // font face rule
    if (rule.type === FONT_FACE_RULE) {
      let font = {};
      rule.declarations.forEach((declaration) => {
        font[declaration.property] = declaration.value;
      });
      fontFaceRules.push(font);
    }

    // media rule
    if (rule.type === MEDIA_RULE) {
      mediaRules.push({
        key: rule.media,
        data: parse(parsedQuery, rule).data
      });
    }
  });

  return {
    styles,
    fontFaceRules,
    mediaRules
  };
};

const genStyleContent = (parsedData, parsedQuery) => {
  const { styles, fontFaceRules, mediaRules } = parsedData;
  const fontFaceContent = getFontFaceContent(fontFaceRules);
  const mediaContent = getMediaContent(mediaRules);
  const warnMessageOutput = parsedQuery.log ? getWarnMessageOutput() : '';

  resetMessage();

  return `var _styles = ${stringifyData(styles)};
  ${fontFaceContent}
  ${mediaContent}
  ${warnMessageOutput}
  module.exports = _styles;
  `;
};

const getWarnMessageOutput = () => {
  const errorMessages = getErrorMessages();
  const warnMessages = getWarnMessages();
  let output = '';

  if (errorMessages) {
    output += `
  if (process.env.NODE_ENV !== 'production') {
    console.error('${errorMessages}');
  }
    `;
  }
  if (warnMessages) {
    output += `
  if (process.env.NODE_ENV !== 'production') {
    console.warn('${warnMessages}');
  }
    `;
  }

  return output;
};

const getMediaContent = (mediaRules) => {
  let content = '';

  mediaRules.forEach((rule, index) => {
    content += `
  if (window.matchMedia && window.matchMedia('${rule.key}').matches) {
    var ruleData = ${stringifyData(rule.data)};
    for(var key in ruleData) {
      _styles[key] = Object.assign(_styles[key], ruleData[key]);
    }
  }
    `;
  });

  return content;
};

const getFontFaceContent = (rules) => {
  let content = '';

  if (rules.length > 0) {
    content += `
  if (typeof FontFace === 'function') {
    `;
  }

  rules.forEach((rule, index) => {
    content += `
    var fontFace${index} = new FontFace('${rule['font-family'].replace(QUOTES_REG, '')}', '${rule.src.replace(QUOTES_REG, '')}');
    document.fonts.add(fontFace${index});
    `;
  });

  if (rules.length > 0) {
    content += `
  }
    `;
  }
  return content;
};

const stringifyData = (data) => {
  return JSON.stringify(data, undefined, '  ');
};
