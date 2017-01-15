import loaderUtils from 'loader-utils';
import parser from './parserHTML';
import pkg from '../package.json';
import path from 'path';
import { transform } from 'babel-core';
import getBabelConfig from './getBabelConfig';

module.exports = function(source) {
  this.cacheable();
  const context = this;
  const filePath = this.resourcePath;
  const query = loaderUtils.parseQuery(this.query);
  const parseObject = parser(source);

  let output = '\nlet _styles = {};\n';

  // parse template
  const template = parseObject.template;
  if (template) {
    output += `let templateLoader = ${getCodeString('template', template, filePath)};\n`;
  }

  // parse script
  const script = parseObject.script;
  if (script) {
    output += `let AppComponent = ${getCodeString('script', script, filePath)}.default;\n`;
  }

  // parse link stylesheet
  const styleSheetLinks = parseObject.styleSheetLinks;
  if (styleSheetLinks.length) {
    styleSheetLinks.forEach((link) => {
      output += `_styles = Object.assign(_styles, require('!!stylesheet-loader!${link}'));\n`;
    });
  }

  // parse style
  const styles = parseObject.styles;
  if (styles) {
    output += `_styles = Object.assign(_styles, ${getCodeString('style', styles[0], filePath)});\n`;
  }

  function getCodeString(type, data, path) {
    let loaderString = '';

    switch (type) {
      case 'template':
        loaderString = `${pkg.name}/lib/template-loader?${JSON.stringify(query)}!${pkg.name}/lib/node-loader?type=template&index=0!`;
        break;
      case 'style':
        loaderString = `stylesheet-loader!${pkg.name}/lib/node-loader?type=styles&index=0!`;
        break;
      case 'script':
        loaderString = `babel-loader?${JSON.stringify(getBabelConfig(query))}!${pkg.name}/lib/node-loader?${JSON.stringify({type: 'script', index: 0, banner: query.banner})}!`;
        break;
    }
    return 'require(' + loaderUtils.stringifyRequest(
      context,
      `!!${loaderString}${path}`
    ) + ')';
  }

  output += `
    if (AppComponent) {
      AppComponent.prototype.render = function() {
        return templateLoader.call(this, _styles);
      }
    }
    module.exports = AppComponent;
  `;
  return output;
};

