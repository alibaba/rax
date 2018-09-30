const path = require('path');
const { OUTPUT_SOURCE_FOLDER, OUTPUT_VENDOR_FOLDER } = require('../../config/CONSTANTS');

const compileES5 = require('./compileES5');

module.exports = (script, { pageName, pagePath, ext, tplImports, tplPropsData }) => {
  let source = 'Page({});';
  const deps = Object.keys(tplImports)
    .map((tagName) => {
      const { templateName, outputPath } = tplImports[tagName];
      const propsData = tplPropsData[templateName] ? JSON.stringify(tplPropsData[templateName]) : '{}';
      const templateRelatedPath = path.relative(path.dirname(pagePath), outputPath);
      const outputPathMate = path.parse(templateRelatedPath);
      delete outputPathMate.base;
      outputPathMate.ext = ext;
      return `'${templateName}': { config: require('${path.format(outputPathMate)}'), propsData: ${propsData} },`;
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
