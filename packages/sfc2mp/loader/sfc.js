/**
 * 分离 SFC 中的三部分
 * part = script | style | template
 */
const { getOptions } = require('loader-utils');

const defaultPart = 'script';
const vueCompiler = require('vue-template-compiler');

module.exports = function sfcLoader(content) {
  const { part = defaultPart } = getOptions(this);
  const { template, script, styles } = vueCompiler.parseComponent(content);

  switch (part) {
    case 'script':
      this.callback(null, script ? script.content : '');
      break;

    case 'template':
      this.callback(null, template ? template.content : '');
      break;

    case 'styles':
      let styleContent = '';
      if (Array.isArray(styles)) {
        styles.forEach((style) => {
          styleContent += style.content;
        });
      }
      this.callback(null, styleContent);
      break;
  }
};