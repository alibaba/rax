const { readFileSync } = require('fs');
const path = require('path');

const { parseSFCParts } = require('../../transpiler/parse');
const compileES5 = require('./compileES5');
const getExt = require('../../config/getExt');
const detectDependencies = require('./detect-dependencies');
const generateStyle = require('./generate-style');
const generateTemplate = require('./generate-template');
const dependenciesHelper = require('./dependencies-helper');
const genTemplateName = require('./genTemplateName');

module.exports = function genTemplate({ path: componentPath }, loaderContext) {
  const templateExt = getExt('template');

  return new Promise((resolve) => {
    const content = readFileSync(componentPath, 'utf-8');
    const { script, styles, template } = parseSFCParts(content);
    const files = [];
    detectDependencies.apply(loaderContext, [script, componentPath]).then((dependenciesMap = {}) => {
      if (Array.isArray(styles)) {
        const styleContents = generateStyle(styles);
        files.push({
          type: 'style',
          contents: styleContents,
        });
      }
      const templatePropsData = {};
      if (template) {
        const { template: templateContents, metadata } = generateTemplate(template, { tplImports: dependenciesMap });

        Object.assign(templatePropsData, metadata.propsDataMap);

        const dependenciesTemplateSpec = Object.values(dependenciesMap)
          .map((dependencies) => {
            const outputPathMate = path.parse(dependencies.filePath);
            delete outputPathMate.base;
            outputPathMate.ext = templateExt;
            outputPathMate.name = dependencies.fileName;
            return dependenciesHelper.getTemplateImportPath(componentPath, path.format(outputPathMate));
          })
          .join('\n');

        const templateContentsRegistered = [
          // 注册 template
          `<template name="${genTemplateName(componentPath)}">`,
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
      }

      Promise.all(
        Object.values(dependenciesMap).map((dependency) => {
          return genTemplate({ path: dependency.filePath }, loaderContext);
        })
      ).then((children) => {
        resolve({
          originPath: componentPath,
          dependenciesMap,
          files: files,
          children,
        });
      });
    });
  });
};
