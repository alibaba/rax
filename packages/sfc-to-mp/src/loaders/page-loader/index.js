const debug = require('debug')('mp');
const path = require('path');

const { parseSFCParts } = require('../../transpiler/parse');
const { OUTPUT_SOURCE_FOLDER, OUTPUT_VENDOR_FOLDER } = require('../../config/CONSTANTS');
const getExt = require('../../config/getExt');
const generateStyle = require('./generateStyle');
const generateTemplate = require('./generateTemplate');
const generateScript = require('./generateScript');
const scriptParser = require('./scriptParser');
const fixedString = require('./fixedString');
const detectDependencies = require('./detectDependencies');
const dependencyHelper = require('./dependencyHelper');

module.exports = function pageLoader(content) {
  const callback = this.async();

  const createPageAbsolutePath = path.join(this.rootContext, OUTPUT_VENDOR_FOLDER, 'createPage.js');

  const templateExt = getExt('template');
  const styleExt = getExt('style');
  const scriptExt = getExt('script');

  const { script, styles = [], template } = parseSFCParts(content);

  const pageOriginFileMate = path.parse(this.resourcePath);

  delete pageOriginFileMate.base;
  // 分析当前 page 文件中的依赖
  detectDependencies
    .bind(this)(script, this.resourcePath)
    .then((dependencyMap) => {
      // 生成 style 文件
      if (Array.isArray(styles)) {
        const styleOutputAbsolutePath = path.format({ ...pageOriginFileMate, ext: styleExt });
        const styleOutputPath = path.relative(this.rootContext, styleOutputAbsolutePath);

        const styleContents = generateStyle(styles);

        const dependenciesImportSpec = Object.values(dependencyMap)
          .map((dependencies) => {
            const outputPath = dependencies.outputPath;
            const outputPathMate = path.parse(outputPath);
            delete outputPathMate.base;
            outputPathMate.ext = styleExt;
            outputPathMate.name = dependencies.fileName;
            return dependencyHelper.getStyleImportPath(styleOutputAbsolutePath, path.format(outputPathMate));
          })
          .join('\n');

        debug(fixedString(styleExt), styleOutputPath);
        debug(fixedString(styleExt), styleOutputPath);

        this.emitFile(styleOutputPath, dependenciesImportSpec + styleContents);
      }
      const templatePropsData = {};
      if (template) {
        const { template: templateContents, metadata } = generateTemplate(template, { dependencyMap: dependencyMap });

        Object.assign(templatePropsData, metadata.propsDataMap);

        const templateOutputAbsolutePath = path.format({ ...pageOriginFileMate, ext: templateExt });
        const templateOutputPath = path.relative(this.rootContext, templateOutputAbsolutePath);

        const dependenciesTemplateSpec = Object.values(dependencyMap)
          .map((dependencies) => {
            const outputPath = dependencies.outputPath;
            const outputPathMate = path.parse(outputPath);
            delete outputPathMate.base;
            outputPathMate.ext = templateExt;
            outputPathMate.name = dependencies.fileName;
            return dependencyHelper.getTemplateImportPath(templateOutputAbsolutePath, path.format(outputPathMate));
          })
          .join('\n');

        debug(fixedString(templateExt), templateOutputPath);
        debug(fixedString(templateExt), dependenciesTemplateSpec);
        this.emitFile(templateOutputPath, dependenciesTemplateSpec + '\n' + templateContents);
      }

      function emitComponentFiles(componentMetaData) {
        const { originPath, files } = componentMetaData;
        const fileTargetPath = path.join(OUTPUT_SOURCE_FOLDER, path.relative(this.rootContext, originPath));
        const fileTargetMetaData = path.parse(fileTargetPath);
        delete fileTargetMetaData.base;
        this.addDependency(originPath);
        files.forEach((file) => {
          fileTargetMetaData.ext = getExt(file.type);
          this.emitFile(path.format(fileTargetMetaData), file.contents);
        });
        componentMetaData.children.forEach(emitComponentFiles.bind(this));
      }

      if (script) {
        scriptParser
          .bind(this)(script)
          .then((componentMetaDataList) => {
            componentMetaDataList.forEach(emitComponentFiles.bind(this));
          })
          .then(() => {
            const scriptAbsolutePath = path.format({ ...pageOriginFileMate, ext: scriptExt });
            const scriptOutputAbsolutePath = path.join(
              this.rootContext,
              OUTPUT_SOURCE_FOLDER,
              path.relative(this.rootContext, scriptAbsolutePath)
            );

            const scriptOutputPath = path.relative(this.rootContext, scriptOutputAbsolutePath);
            const pageRelatedPath = path.relative(path.dirname(scriptAbsolutePath), scriptOutputAbsolutePath);
            const createPageRelatedPath = path.relative(path.dirname(scriptAbsolutePath), createPageAbsolutePath);

            const { code, map, source } = generateScript(script, {
              pagePath: scriptAbsolutePath,
              ext: scriptExt,
              dependencyMap: dependencyMap,
              templatePropsData: templatePropsData,
              createPageRelatedPath,
              pageRelatedPath,
            });

            debug(fixedString(scriptExt), scriptOutputPath);
            this.emitFile(scriptOutputPath, code, map);
            callback(null, source);
          });
      } else {
        callback(null, 'Page({});');
      }
    });
};
