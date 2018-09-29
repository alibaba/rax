const {
  OUTPUT_SOURCE_FOLDER,
  OUTPUT_VENDOR_FOLDER,
} = require('../../config/CONSTANTS');

const compileES5 = require('./compileES5');

module.exports = (script, { pageName, tplImports, tplPropsData }) => {
  let source = 'Page({});';
  const deps = Object.keys(tplImports)
    .map(tagName => {
      const { tplName, configPath } = tplImports[tagName];
      const propsData = tplPropsData[tplName]
        ? JSON.stringify(tplPropsData[tplName])
        : '{}';
      return `'${tplName}': { config: require('/${configPath}'), propsData: ${propsData} },`;
    })
    .join('\n');
  source = [
    `var pageConfig = require('/${OUTPUT_SOURCE_FOLDER}/${pageName}');`,
    `var createPage = require('/${OUTPUT_VENDOR_FOLDER}/createPage');`,
    `Page(createPage(pageConfig, {${deps}}));`,
  ].join('\n');

  const { code, map } = compileES5(script.content, {
    sourceMaps: true,
  });
  return { code, map, source };
};
