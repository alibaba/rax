const { getOptions } = require('loader-utils');
const debug = require('debug')('mp');
const path = require('path');

const { parseSFCParts } = require('../../transpiler/parse');
const getExt = require('../../config/getExt');
const { OUTPUT_SOURCE_FOLDER } = require('../../config/CONSTANTS');
const generateStyle = require('./generate-style');
const generateTemplate = require('./generate-template');
const generateScript = require('./generate-script');
const scriptParser = require('./script-parser');
const fixedString = require('./fixed-string');
const detectDependencies = require('./detect-dependencies');
const dependenciesHelper = require('./dependencies-helper');

module.exports = function pageLoader(content) {
  const callback = this.async();
  const { resourcePath } = this;
  const { pageName } = getOptions(this);

  const templateExt = getExt('template');
  const styleExt = getExt('style');
  const scriptExt = getExt('script');

  const { script, styles, template } = parseSFCParts(content);

  // 分析当前 page 文件中的依赖
  detectDependencies.apply(this, [script, this.resourcePath]).then((dependenciesMap) => {
    // 生成 style 文件
    if (Array.isArray(styles)) {
      const styleContents = generateStyle(styles);
      const styleOutputPath = `${pageName}${styleExt}`;
      debug(fixedString(styleExt), styleOutputPath);
      this.emitFile(styleOutputPath, styleContents);
    }
    const templatePropsData = {};
    if (template) {
      const { template: templateContents, metadata } = generateTemplate(template, { tplImports: dependenciesMap });

      Object.assign(templatePropsData, metadata.propsDataMap);

      const templateOutputAbsolutePath = path.join(this.rootContext, `${pageName}${templateExt}`);
      const templateOutputPath = path.relative(this.rootContext, templateOutputAbsolutePath);

      const dependenciesTemplateSpec = Object.values(dependenciesMap)
        .map((dependencies) => {
          const outputPath = dependencies.outputPath;
          const outputPathMate = path.parse(outputPath);
          delete outputPathMate.base;
          outputPathMate.ext = templateExt;
          outputPathMate.name = dependencies.fileName;
          return dependenciesHelper.getTemplateImportPath(templateOutputAbsolutePath, path.format(outputPathMate));
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
      // 分析当前页面中的依赖文件
      scriptParser
        .apply(this, [script, { resourcePath, pageName }])
        .then((componentMetaDataList) => {
          componentMetaDataList.forEach(emitComponentFiles.bind(this));
        })
        .then(() => {
          const scriptOutputAbsolutePath = path.join(this.rootContext, OUTPUT_SOURCE_FOLDER, `${pageName}${scriptExt}`);
          const scriptAbsolutePath = path.join(this.rootContext, `${pageName}${scriptExt}`);

          const scriptOutputPath = path.relative(this.rootContext, scriptOutputAbsolutePath);

          const { code, map, source } = generateScript(script, {
            pagePath: scriptAbsolutePath,
            pageName,
            ext: scriptExt,
            tplImports: dependenciesMap,
            tplPropsData: templatePropsData,
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
