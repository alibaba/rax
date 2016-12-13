import loaderUtils from 'loader-utils';
import { parser } from './utils';
import pkg from '../package.json';
import path from 'path';

module.exports = function(source) {
  let output = flattenStyleCode + '\nvar allStyles = [];\n';

  this.cacheable && this.cacheable();
  const context = this;
  const filePath = this.resourcePath;
  const fileName = path.basename(filePath);

  const query = loaderUtils.parseQuery(this.query);
  const parseObject = parser(source);

  const template = parseObject.template;
  if (template) {
    output += `var templateLoader = ${getCodeString('template', template, filePath)};\n`;
  }

  const styleLinks = parseObject.styleLinks;
  if (styleLinks.length) {
    styleLinks.forEach((link) => {
      output += `allStyles.push(require('!!stylesheet-loader!${link}'));\n`;
    });
  }

  const styles = parseObject.styles;
  if (styles) {
    output += `allStyles.push(${getCodeString('style', styles[0], filePath)});\n`;
  }

  function getCodeString(type, data, path) {
    let loaderString = '';

    switch (type) {
      case 'template':
        loaderString += `${pkg.name}/lib/template-loader?engine=${query.engine}&project=${query.project}!${pkg.name}/lib/type-loader?type=template&index=0!`;
        break;
      case 'style':
        loaderString += `stylesheet-loader!${pkg.name}/lib/type-loader?type=styles&index=0!`;
    }
    return 'require(' + loaderUtils.stringifyRequest(
      context,
      `!!${loaderString}${path}`
    ) + ')';
  }

  const code = `
    var styles = flattenStyle(allStyles);
    function _component(props, context) {
      return templateLoader.render(props, context, styles);
    };
    module.exports = _component;
  `;

  output += code;
  return output;
};

const flattenStyleCode = `
function flattenStyle(style) {
  if (!style) {
    return undefined;
  }

  if (!Array.isArray(style)) {
    return style;
  } else {
    let result = {};
    for (let i = 0; i < style.length; ++i) {
      let computedStyle = flattenStyle(style[i]);
      if (computedStyle) {
        for (let key in computedStyle) {
          result[key] = computedStyle[key];
        }
      }
    }
    return result;
  }
}
`;
