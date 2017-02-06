'use strict';

import css from 'css';
import transformer from './transformer';
import loaderUtils from 'loader-utils';
import {getErrorMessages, getWarnMessages} from './promptMessage';

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

  const parseData = parse(this.query, stylesheet);

  return exportContent(parseData);
};

const parse = (query, stylesheet) => {
  let data = {};
  let fontFaceRules = [];
  let mediaRules = [];
  const parseQuery = loaderUtils.parseQuery(query);
  const transformDescendantCombinator = parseQuery.transformDescendantCombinator;

  stylesheet.rules.forEach(function(rule) {
    let style = {};

    // normal rule
    if (rule.type === RULE) {
      style = transformer.convert(rule);

      rule.selectors.forEach((selector) => {
        let sanitizedSelector = transformer.sanitizeSelector(selector, transformDescendantCombinator);
        if (sanitizedSelector) {
          data[sanitizedSelector] = Object.assign(data[sanitizedSelector] || {}, style);
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
        data: parse(query, rule).data
      });
    }
  });

  return {
    data,
    fontFaceRules,
    mediaRules
  };
};

const exportContent = (parseData) => {
  const {data, fontFaceRules, mediaRules} = parseData;
  const fontFaceContent = getFontFaceContent(fontFaceRules);
  const mediaContent = getMediaContent(parseData);

  return `
    var data = ${stringifyData(data)};
    ${fontFaceContent}
    ${mediaContent}

    if (process.env.NODE_ENV !== 'production') {
      console.error('${getErrorMessages()}');
      console.warn('${getWarnMessages()}');
    }
    module.exports = data;
  `;
};

const getMediaContent = (parseData) => {
  const {data, mediaRules} = parseData;
  let content = '';

  mediaRules.forEach((rule, index) => {
    content += `
      if (window.matchMedia('${rule.key}').matches) {
        var ruleData = ${stringifyData(rule.data)};
        for(var key in ruleData) {
          data[key] = Object.assign(data[key], ruleData[key]);
        }
      }
    `;
  });

  return content;
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

const stringifyData = (data) => {
  return JSON.stringify(data, undefined, '  ');
};
