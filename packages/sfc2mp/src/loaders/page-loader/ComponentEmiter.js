const path = require('path');
const debug = require('debug')('mp:emiter');
const getExt = require('../../config/getExt');
const dependencyHelper = require('./dependencyHelper');

const ComponentEmiter = class ComponentEmiter {
  constructor(loaderContext) {
    this.loaderContext = loaderContext;
  }

  emitStyle({ filepath, contents, dependencyMap }) {
    const ext = getExt('style');
    const filePathMate = path.parse(filepath);
    delete filePathMate.base;
    const styleAbsolutePath = path.format({ ...filePathMate, ext });
    const styleOutputPath = path.relative(this.loaderContext.rootContext, styleAbsolutePath);

    const dependenciesImportSpec = Object.values(dependencyMap)
      .map((dependencies) => {
        const outputPath = dependencies.outputPath;
        const outputPathMate = path.parse(outputPath);
        delete outputPathMate.base;
        outputPathMate.ext = ext;
        return dependencyHelper.getStyleImportPath(styleAbsolutePath, path.format(outputPathMate));
      })
      .join('\n');

    debug(styleOutputPath);
    this.loaderContext.emitFile(styleOutputPath, dependenciesImportSpec + '\n' + contents);
  }
  emitTemplate({ filepath, contents, dependencyMap, registyTemplate, templateName }) {
    const ext = getExt('template');
    const filePathMate = path.parse(filepath);
    delete filePathMate.base;
    const templateAbsolutePath = path.format({ ...filePathMate, ext });
    const templateOutputPath = path.relative(this.loaderContext.rootContext, templateAbsolutePath);

    const dependenciesTemplateSpec = Object.values(dependencyMap)
      .map((dependencies) => {
        const outputPathMate = path.parse(dependencies.outputPath);
        delete outputPathMate.base;
        outputPathMate.ext = ext;
        return dependencyHelper.getTemplateImportPath(templateAbsolutePath, path.format(outputPathMate));
      })
      .join('\n');

    const contentsList = [contents];

    if (registyTemplate) {
      contentsList.unshift(`<template name="${templateName}">`);
      contentsList.push('</template>');
    }

    contentsList.unshift(dependenciesTemplateSpec);

    debug(templateOutputPath);
    this.loaderContext.emitFile(templateOutputPath, contentsList.join('\n'));
  }
  emitScript({ filepath, contents }) {
    const ext = getExt('script');
    const filePathMate = path.parse(filepath);
    delete filePathMate.base;
    const scriptAbsolutePath = path.format({ ...filePathMate, ext });
    const scriptOutputPath = path.relative(this.loaderContext.rootContext, scriptAbsolutePath);

    debug(scriptOutputPath);
    this.loaderContext.emitFile(scriptOutputPath, contents);
  }
};

module.exports = ComponentEmiter;
