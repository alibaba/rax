const path = require('path');

const compileES5 = require('./compileES5');
/**
 * Generate script contents data from page file tag <script/> contents
 *
 * @param {object} script Script object from vue-template-compiler
 * @param {object} matedata
 */
module.exports = function generateScript(
  script,
  { pagePath, ext, dependencyMap, templatePropsData, createPageRelatedPath, pageRelatedPath }
) {
  let source = 'Page({});';
  const deps = Object.keys(dependencyMap)
    .map((tagName) => {
      const { templateName, outputPath } = dependencyMap[tagName];
      const propsData = templatePropsData[templateName] ? JSON.stringify(templatePropsData[templateName]) : '{}';
      const templateRelatedPath = path.relative(path.dirname(pagePath), outputPath);
      const outputPathMate = path.parse(templateRelatedPath);
      delete outputPathMate.base;
      outputPathMate.ext = ext;
      return `'${templateName}': { config: require('${path.format(outputPathMate)}'), propsData: ${propsData} },`;
    })
    .join('\n');

  source = [
    `var pageConfig = require('${pageRelatedPath}');`,
    `var createPage = require('${createPageRelatedPath}');`,
    `Page(createPage(pageConfig, {${deps}}));`,
  ].join('\n');

  const { code, map } = compileES5(script.content, {
    sourceMaps: true,
  });
  return { code, map, source };
};
