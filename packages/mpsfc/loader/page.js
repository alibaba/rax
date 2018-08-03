const { stringifyRequest, getOptions } = require('loader-utils');
const vueCompiler = require('vue-template-compiler');
const transpile = require('../transpile');
const { compileES5, genName, genDepAxml, getBabelrc } = require('../utils');
const { parseComponentsDeps } = require('../utils/parser');
const { parse, resolve, dirname, extname } = require('path');
const pug = require('pug');

const babelOptions = { extends: getBabelrc(), plugins: [parseComponentsDeps] };
const babel = require('babel-core');

module.exports = function pageLoader(content) {
  const { script, styles, template } = vueCompiler.parseComponent(content);
  const { resourcePath } = this;
  const { pageName } = getOptions(this);

  if (template && template.lang === 'pug') {
    template.content = pug.render(template.content);
  }

  const tplDeps = [];
  const tplImports = {};
  const tplPropsData = {};
  if (script) {
    const babelResult = babel.transform(script.content, babelOptions);
    const { components: importedComponentsMap } = babelResult.metadata;
    Object.keys(importedComponentsMap || {}).forEach((tagName) => {
      let modulePath = importedComponentsMap[tagName];
      const { name } = parse(modulePath);

      let vueModulePath = resolve(dirname(resourcePath), modulePath);

      if (modulePath.indexOf('@/') === 0) {
        vueModulePath = resolve(this.rootContext, modulePath.slice(2));
      }


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
      this.emitFile(tplReq.slice(1), genDepAxml({
        path: extname(vueModulePath) === '.html'
          ? vueModulePath
          : vueModulePath + '.html',
        tplName,
        name
      }, this));
      tplDeps.push(`<import src="${tplReq}" />\n`);
    });
  }

  if (Array.isArray(styles)) {
    const style = styles.map(s => s.content).join('\n');
    this.emitFile(`${pageName}.acss`, style);
  }

  if (template) {
    const { template: tpl, metadata } = transpile(template.content, { tplImports });
    Object.assign(tplPropsData, metadata.propsDataMap);

    this.emitFile(`${pageName}.axml`, tplDeps.join('\n') + tpl);
  }

  let source = 'Page({});';

  if (script) {
    const deps = Object.keys(tplImports).map((tagName) => {
      const { tplName, filename } = tplImports[tagName];
      return `'${tplName}': {
  config: require('/assets/components/${filename}'),
  propsData: ${tplPropsData[tplName] ? JSON.stringify(tplPropsData[tplName]) : '{}'},
},`;
    }).join('\n');
    source = [
      `var pageConfig = require('/assets/${pageName}');`,
      'var transPageConfig = require(\'/assets/vendor/transPageConfig\');',
      `Page(transPageConfig(pageConfig, {
        ${deps}
      }));`
    ].join('\n');

    const { code, map } = compileES5(script.content, {
      sourceMaps: true
    });
    this.emitFile(`assets/${pageName}.js`, code, map);
  }
  this.callback(null, source);
};
