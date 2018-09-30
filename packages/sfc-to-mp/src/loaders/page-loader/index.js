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
  detectDependencies.call(this, script).then((dependenciesMap) => {
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
          outputPathMate.name = dependencies.templateName;
          return dependenciesHelper.getTemplateImportPath(templateOutputAbsolutePath, path.format(outputPathMate));
        })
        .join('\n');

      debug(fixedString(templateExt), templateOutputPath);
      debug(fixedString(templateExt), dependenciesTemplateSpec);
      this.emitFile(templateOutputPath, dependenciesTemplateSpec + '\n' + templateContents);
    }

    // let dependencies = [];
    // let imports = {};

    // const emitParsedFile = ({ path, contents, originPath, children }) => {
    //   if (originPath) {
    //     debug(fixedString('addDependency'), originPath);
    //     this.addDependency(originPath);
    //   }
    //   if (path) {
    //     debug(fixedString('emitFile'), path);
    //     this.emitFile(path, contents);
    //   }
    //   if (Array.isArray(children) && children.length > 0) {
    //     children.forEach(emitParsedFile);
    //   }
    // };

    // if (script) {
    //   const result = scriptParser(script, { resourcePath, pageName });
    //   dependencies = result.dependencies;
    //   imports = result.imports;
    //   emitParsedFile.call(this, result);
    // }

    // if (template) {
    //   const { template: templateContents, metadata } = generateTemplate(template, { tplImports: imports });

    //   Object.assign(tplPropsData, metadata.propsDataMap);

    //   const templateOutputPath = `${pageName}${templateExt}`;
    //   debug(fixedString(templateExt), templateOutputPath);

    //   this.emitFile(templateOutputPath, dependencies.join('\n') + templateContents);
    // }

    // if (script) {
    //   const { code, map, source } = generateScript(script, {
    //     pageName,
    //     tplImports: imports,
    //     tplPropsData,
    //   });
    //   const scriptOutputPath = `${OUTPUT_SOURCE_FOLDER}/${pageName}${scriptExt}`;
    //   debug(fixedString(scriptExt), scriptOutputPath);
    //   this.emitFile(scriptOutputPath, code, map);
    //   callback(null, source);
    // } else {
    //   callback(null, 'Page({});');
    // }
    callback(null, 'Page({});');
  });
};
