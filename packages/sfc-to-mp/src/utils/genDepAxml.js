const { join, resolve, parse, dirname, extname } = require('path');
const { readFileSync } = require('fs');
const babel = require('babel-core');
const { parseSFCParts } = require('../transpiler/parse');
const { parseComponentsDeps } = require('../parser');
const compileES5 = require('./compileES5');
const genTemplateName = require('./genTemplateName');
const transpiler = require('../transpiler');

module.exports = function genDepAxml(
  { path, tplName, name, pageName, modulePath },
  loaderCtx
) {
  const { emitFile, addDependency } = loaderCtx;
  addDependency(path);

  const content = readFileSync(path, 'utf-8');
  const { script, styles, template } = parseSFCParts(content);

  if (template && template.lang === 'pug') {
    template.content = pug.render(template.content);
  }

  const tplImports = {};
  const pageBase = join(pageName, '..', modulePath);
  if (script) {
    const babelResult = babel.transform(script.content, {
      plugins: [parseComponentsDeps],
    });
    const {
      components: importedComponentsMap,
    } = babelResult.metadata;
    Object.keys(importedComponentsMap || {}).forEach(tagName => {
      let modulePath = importedComponentsMap[tagName];

      const { name } = parse(modulePath);
      const vueModulePath = resolve(dirname(path), modulePath);
      const tplName = genTemplateName(vueModulePath);
      /**
       * name: 模块名称, name="title"
       * tplName: sfc2mp 生成的唯一名称, 用于 import 和生成 axml
       */
      tplImports[tagName] = {
        tagName,
        tplName,
        filename: name,
      };
      const tplReq = `/components/${tplName}.axml`;
      emitFile(
        tplReq.slice(1),
        genDepAxml(
          {
            path:
              extname(vueModulePath) === '.html'
                ? vueModulePath
                : vueModulePath + '.html',
            tplName,
            pageName: pageBase,
            modulePath,
            name,
          },
          loaderCtx
        )
      );
    });
  }

  const { template: tpl, metadata } = transpiler(template.content, {
    tplImports,
    isTemplateDependency: true,
    templateName: tplName,
  });

  let scriptCode = 'module.exports = {};';
  if (script) {
    const { code } = compileES5(script.content);
    scriptCode = code;
  }

  /**
   * 生成组件样式
   */
  if (Array.isArray(styles)) {
    const style = styles.map(s => s.content).join('\n');
    emitFile(`components/${tplName}.acss`, style);
  }

  /**
   * 生成组件 js context
   */
  const scriptPath = join(
    'assets',
    pageName,
    '..',
    modulePath + '.js'
  );
  emitFile(scriptPath, scriptCode);

  const codes = [
    // 注册 template
    `<template name="${tplName}">`,
    tpl,
    '</template>',
  ];

  Object.keys(tplImports).forEach(name => {
    const { tplName } = tplImports[name];
    codes.unshift(`<import src="/components/${tplName}.axml" />`);
  });

  // codes.unshift();
  return codes.join('\n');
};
