const { readFileSync } = require('fs');
const path = require('path');

const { parseSFCParts } = require('../../transpiler/parse');
const compileES5 = require('./compileES5');
const detectDependencies = require('./detectDependencies');
const generateStyle = require('./generateStyle');
const generateTemplate = require('./generateTemplate');
const getTemplateName = require('./getTemplateName');
const { OUTPUT_SOURCE_FOLDER } = require('../../config/CONSTANTS');

/**
 * SFC file parser with in webpack loader context
 * Return the parsed file contents node tree
 *
 * @param {string} componentPath SFC file path
 */
module.exports = function componentParser(componentPath) {
  return new Promise((resolve) => {
    const content = readFileSync(componentPath, 'utf-8');
    const { script, styles, template } = parseSFCParts(content);
    const files = [];

    const originPath = componentPath;
    const outputPath = path.join(
      this.rootContext,
      OUTPUT_SOURCE_FOLDER,
      path.relative(this.rootContext, componentPath)
    );

    detectDependencies
      .bind(this)(script, componentPath)
      .then((dependencyMap = {}) => {
        if (Array.isArray(styles)) {
          const styleContents = generateStyle(styles);
          files.push({
            type: 'style',
            contents: styleContents,
          });
        }
        const templatePropsData = {};
        if (template) {
          const { template: templateContents, metadata } = generateTemplate(template, { dependencyMap: dependencyMap });

          Object.assign(templatePropsData, metadata.propsDataMap);

          files.push({
            type: 'template',
            contents: templateContents,
          });
        }
        let scriptCode = 'module.exports = {};';

        if (script) {
          const { code } = compileES5(script.content);
          scriptCode = code;
          files.push({
            type: 'script',
            contents: scriptCode,
          });
        } else {
          files.push({
            type: 'script',
            contents: scriptCode,
          });
        }

        Promise.all(
          Object.values(dependencyMap).map((dependency) => {
            return componentParser.bind(this)(dependency.filePath);
          })
        ).then((children) => {
          resolve({
            originPath,
            outputPath,
            templateName: getTemplateName(originPath),
            dependencyMap,
            templatePropsData,
            files: files,
            children,
          });
        });
      });
  });
};
