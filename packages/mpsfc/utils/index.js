const { join, parse, resolve, dirname, extname } = require('path');
const { transformSync } = require('@babel/core');

function getBabelOptions() {
  return {
    presets: [
      require('@babel/preset-env'),
    ],
    plugins: [
      // Stage 0
      require('@babel/plugin-proposal-function-bind'),
      // Stage 1
      require('@babel/plugin-proposal-export-default-from'),
      require('@babel/plugin-proposal-logical-assignment-operators'),
      [require('@babel/plugin-proposal-optional-chaining'), { 'loose': false }],
      [require('@babel/plugin-proposal-pipeline-operator'), { 'proposal': 'minimal' }],
      [require('@babel/plugin-proposal-nullish-coalescing-operator'), { 'loose': false }],
      require('@babel/plugin-proposal-do-expressions'),
      // Stage 2
      [require('@babel/plugin-proposal-decorators'), { 'legacy': true }],
      require('@babel/plugin-proposal-function-sent'),
      require('@babel/plugin-proposal-export-namespace-from'),
      require('@babel/plugin-proposal-numeric-separator'),
      require('@babel/plugin-proposal-throw-expressions'),
      // Stage 3
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-syntax-import-meta'),
      [require('@babel/plugin-proposal-class-properties'), { 'loose': false }],
      require('@babel/plugin-proposal-json-strings')
    ]
  }
};

const { existsSync } = require('fs');
const getBabelrc = exports.getBabelrc = function getBabelrc() {
  const projectDir = process.cwd();
  const babelrcPath = join(projectDir, '.babelrc');
  if (existsSync(babelrcPath)) {
    return babelrcPath;
  } else {
    return void 0;
  }
}

exports.compileES5 = function compileES5(str, opts) {
  const { code, map, ast } = transformSync(str, Object.assign(getBabelOptions(), opts));
  return { code, map, ast };
};


const hash = require('hash-sum');
const genName = exports.genName = function genName(p) {
  const { name } = parse(p);
  return `${name}$${hash(p)}`;
}

const { readFileSync } = require('fs');
const vueCompiler = require('vue-template-compiler');
const transpile = require('../transpile');
const babel = require('babel-core');
const pug = require('pug');
const { parseComponentsDeps } = require('./parser');
const babelOptions = { extends: getBabelrc(), plugins: [parseComponentsDeps] }
exports.genDepAxml = function genDepAxml({ path, tplName, name }, loaderCtx) {
  const { emitFile, addDependency } = loaderCtx;
  addDependency(path);

  const content = readFileSync(path, 'utf-8');
  const { script, styles, template } = vueCompiler.parseComponent(content);

  if (template && template.lang === 'pug') {
    template.content = pug.render(template.content);
  }

  const tplImports = {};
  if (script) {
    const babelResult = babel.transform(script.content, babelOptions);
    const { components: importedComponentsMap } = babelResult.metadata;
    Object.keys(importedComponentsMap || {}).forEach((tagName) => {
      let modulePath = importedComponentsMap[tagName];

      const { name } = parse(modulePath);
      const vueModulePath = resolve(dirname(path), modulePath);
      const tplName = genName(vueModulePath);
      /**
       * name: 模块名称, name="title"
       * tplName: vmp 生成的唯一名称, 用于 import 和生成 axml
       */
      tplImports[tagName] = {
        tagName,
        tplName,
        filename: name,
      };
      const tplReq = `/components/${tplName}.axml`;
      emitFile(tplReq.slice(1), genDepAxml({
        path: extname(vueModulePath) === '.html'
          ? vueModulePath
          : vueModulePath + '.html',
        tplName,
        name
      }, loaderCtx));
    });
  }

  const { template: tpl, metadata } = transpile(template.content, {
    tplImports,
    isTemplateDependency: true,
    templateName: tplName
  });

  let scriptCode = 'module.exports = {};';
  if (script) {
    const { code } = exports.compileES5(script.content);
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
  emitFile(`assets/components/${name}.js`, scriptCode);

  const codes = [
    // 注册 template
    `<template name="${tplName}">`,
    tpl,
    `</template>`
  ];

  Object.keys(tplImports).forEach((name) => {
    const { tplName } = tplImports[name];
    codes.unshift(`<import src="/components/${tplName}.axml" />`);
  });

  // codes.unshift();
  return codes.join('\n');
}


const { parseConfig, parseGlobalComponents } = require('../utils/parser');
const FIRST_PAGE_RE = /^\^/;
exports.getAppJSON = function getAppJSON(rootDir) {
  const appJSONPath = join(rootDir, 'manifest.json');

  if (!existsSync(appJSONPath)) {
    throw new Error('manifest.json not exists');
  }

  const appJSON = JSON.parse(readFileSync(appJSONPath, 'utf-8'));

  appJSON._pages = appJSON.pages;
  appJSON.pages = formatPages(appJSON.pages);
  return appJSON;
}

function formatPages(pages) {
  return Object.values(pages);
}


const getPageSrc = exports.getPageSrc = function getPageSrc(pageName) {
  return parse(pageName).dir ? pageName : `pages/${pageName}/${pageName}`
}
