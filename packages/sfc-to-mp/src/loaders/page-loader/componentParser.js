const { readFileSync } = require('fs');
const path = require('path');

const { parseSFCParts } = require('../../transpiler/parse');
const compileES5 = require('./compileES5');
const getExt = require('../../config/getExt');
const detectDependencies = require('./detectDependencies');
const generateStyle = require('./generateStyle');
const generateTemplate = require('./generateTemplate');
const dependencyHelper = require('./dependencyHelper');
const getTemplateName = require('./getTemplateName');

/**
 * SFC file parser with in webpack loader context
 * Return the parsed file contents node tree
 *
 *
 * @param {string} componentPath SFC file path
 * @return \{{{type}}\} {{description}}{{}}
 */
module.exports = function componentParser(componentPath) {
  const templateExt = getExt('template');

  return new Promise((resolve) => {
    const content = readFileSync(componentPath, 'utf-8');
    const { script, styles, template } = parseSFCParts(content);
    const files = [];

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

          const dependenciesTemplateSpec = Object.values(dependencyMap)
            .map((dependencies) => {
              const outputPathMate = path.parse(dependencies.filePath);
              delete outputPathMate.base;
              outputPathMate.ext = templateExt;
              outputPathMate.name = dependencies.fileName;
              return dependencyHelper.getTemplateImportPath(componentPath, path.format(outputPathMate));
            })
            .join('\n');

          const templateContentsRegistered = [
            // 注册 template
            `<template name="${getTemplateName(componentPath)}">`,
            templateContents,
            '</template>',
          ];

          templateContentsRegistered.unshift(dependenciesTemplateSpec);
          files.push({
            type: 'template',
            contents: templateContentsRegistered.join('\n'),
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
            originPath: componentPath,
            dependencyMap,
            files: files,
            children,
          });
        });
      });
  });
};
