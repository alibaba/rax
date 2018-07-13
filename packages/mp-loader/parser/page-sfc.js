const { existsSync, readFileSync } = require('fs');

/**
 * 解析 wx dsl 为 sfcDesciptor
 * sfcDesciptor: {
 *   template: Object,
 *   script: Object,
 *   style: Object,
 * }
 * > https://developers.weixin.qq.com/miniprogram/dev/framework/config.html
 * > 文件名不需要写文件后缀，因为框架会自动去寻找路径下 .json, .js, .wxml, .wxss 四个文件进行整合。
 * resourcePath 指 js 文件绝对路径
 */
const EXT = {
  wx: {
    template: '.wxml',
    style: '.wxss',
    script: '.js'
  },
  my: {
    template: '.axml',
    style: '.acss',
    script: '.js'
  }
};
module.exports = function parseSFC(resourcePath, { script, type }) {
  const result = {
    template: null,
    script: {
      path: resourcePath,
      content: script
    },
    style: null
  };
  const templatePath = resourcePath.replace('.js', EXT[type].template);
  if (existsSync(templatePath)) {
    result.template = {
      path: templatePath,
      content: readFileSync(templatePath, 'utf-8')
    };
  }
  const stylePath = resourcePath.replace('.js', EXT[type].style);
  if (existsSync(stylePath)) {
    result.style = {
      path: stylePath,
      content: readFileSync(stylePath, 'utf-8')
    };
  }

  return result;
};
