const { getOptions } = require('loader-utils');
const debug = require('debug')('mp');

const { parseSFCParts } = require('../../transpiler/parse');
const getExt = require('../../config/getExt');
const { OUTPUT_SOURCE_FOLDER } = require('../../config/CONSTANTS');
const generateStyle = require('./generate-style');
const generateTemplate = require('./generate-template');
const generateScript = require('./generate-script');
const scriptParser = require('./script-parser');
const fixedString = require('./fixed-string');

module.exports = function pageLoader(content) {
  const templateExt = getExt('template');
  const styleExt = getExt('style');
  const scriptExt = getExt('script');

  const { script, styles, template } = parseSFCParts(content);
  const { resourcePath } = this;
  const { pageName } = getOptions(this);

  let dependencies = [];
  let imports = {};
  const tplPropsData = {};

  const emitParsedFile = ({
    path,
    contents,
    originPath,
    children,
  }) => {
    if (originPath) {
      debug(fixedString('addDependency'), originPath);
      this.addDependency(originPath);
    }
    if (path) {
      debug(fixedString('emitFile'), path);
      this.emitFile(path, contents);
    }
    if (Array.isArray(children) && children.length > 0) {
      children.forEach(emitParsedFile);
    }
  };

  if (script) {
    const result = scriptParser(script, { resourcePath, pageName });
    dependencies = result.dependencies;
    imports = result.imports;
    emitParsedFile.call(this, result);
  }

  if (Array.isArray(styles)) {
    const styleContents = generateStyle(styles);
    const styleOutputPath = `${pageName}${styleExt}`;
    debug(fixedString(styleExt), styleOutputPath);
    this.emitFile(styleOutputPath, styleContents);
  }

  if (template) {
    const { template: templateContents, metadata } = generateTemplate(
      template,
      { tplImports: imports }
    );

    Object.assign(tplPropsData, metadata.propsDataMap);

    const templateOutputPath = `${pageName}${templateExt}`;
    debug(fixedString(templateExt), templateOutputPath);

    this.emitFile(
      templateOutputPath,
      dependencies.join('\n') + templateContents
    );
  }

  if (script) {
    const { code, map, source } = generateScript(script, {
      pageName,
      tplImports: imports,
      tplPropsData,
    });
    const scriptOutputPath = `${OUTPUT_SOURCE_FOLDER}/${pageName}${scriptExt}`;
    debug(fixedString(scriptExt), scriptOutputPath);
    this.emitFile(scriptOutputPath, code, map);
    this.callback(null, source);
  } else {
    this.callback(null, 'Page({});');
  }
};
