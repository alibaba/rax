const { readFileSync } = require('fs');
const path = require('path');

const { parseSFCParts } = require('../../transpiler/parse');
const { OUTPUT_SOURCE_FOLDER } = require('../../config/CONSTANTS');
const transpiler = require('../../transpiler');

const compileES5 = require('./compileES5');
const detectDependencies = require('./detectDependencies');
const getTemplateName = require('./getTemplateName');

/**
 * SFC file parser with in webpack loader context
 * Return the parsed file contents node tree
 *
 * @param {string} componentPath SFC file path
 */

const generateTemplate = function(template, options) {
  return transpiler(template.content, options);
};

module.exports = function componentParser(componentPath, options = {}) {
  const templateName = getTemplateName(componentPath);
  return new Promise((resolve) => {
    const content = readFileSync(componentPath, 'utf-8');
    const { script, styles, template } = parseSFCParts(content);
    const files = [];

    const outputPath = path.join(
      this.rootContext,
      OUTPUT_SOURCE_FOLDER,
      path.relative(this.rootContext, componentPath)
    );

    detectDependencies
      .bind(this)(script, componentPath)
      .then((dependencyMap = {}) => {
        if (Array.isArray(styles)) {
          const styleContents = styles.map((s) => s.content).join('\n');
          files.push({
            type: 'style',
            contents: styleContents,
          });
        }
        const templatePropsData = {};
        if (template) {
          const { template: templateContents, metadata } = generateTemplate(template, {
            dependencyMap: dependencyMap,
            ...options,
          });

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
            const childTemplateName = getTemplateName(dependency.filePath);
            return componentParser.bind(this)(dependency.filePath, {
              isTemplateDependency: true,
              templateName: childTemplateName,
            });
          })
        ).then((children) => {
          resolve({
            originPath: componentPath,
            outputPath,
            templateName,
            dependencyMap,
            templatePropsData,
            files: files,
            children,
          });
        });
      });
  });
};
