const { getOptions } = require('loader-utils');
const { join, parse, resolve, dirname, extname } = require('path');
const transpiler = require('../transpiler');
const compileES5 = require('../utils/compileES5');
const genTemplateName = require('../utils/genTemplateName');
const genDepAxml = require('../utils/genDepAxml');
const { parseComponentsDeps } = require('../parser');
const { parseSFCParts } = require('../transpiler/parse');
const babel = require('babel-core');

const {
  OUTPUT_SOURCE_FOLDER,
  OUTPUT_VENDOR_FOLDER,
} = require('../config/CONSTANTS');

module.exports = function pageLoader(content) {
  const { script, styles, template } = parseSFCParts(content);
  const { resourcePath } = this;
  const { pageName } = getOptions(this);

  const tplDeps = [];
  const tplImports = {};
  const tplPropsData = {};
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

      let vueModulePath = resolve(dirname(resourcePath), modulePath);
      if (modulePath.indexOf('@/') === 0) {
        vueModulePath = resolve(
          this.rootContext,
          modulePath.slice(2)
        );
      }

      const tplName = genTemplateName(vueModulePath);
      const tplPath = join(
        OUTPUT_SOURCE_FOLDER,
        'components',
        modulePath
      );
      const tplPath2 = join(
        OUTPUT_SOURCE_FOLDER,
        'components',
        genTemplateName(modulePath)
      );

      /**
       * name: 模块名称, name="title"
       * tplName: vmp 生成的唯一名称, 用于 import 和生成 axml
       */
      tplImports[tagName] = {
        tagName,
        tplName,
        filename: name,
        configPath: tplPath,
      };

      const p =
        extname(vueModulePath) === '.html'
          ? vueModulePath
          : vueModulePath + '.html';

      const axmlContent = genDepAxml(
        {
          path: p,
          pageName,
          modulePath,
          tplName,
          name,
        },
        this
      );
      this.emitFile(tplPath2 + '.axml', axmlContent);
      tplDeps.push(`<import src="/${tplPath2 + '.axml'}" />\n`);
    });
  }

  if (Array.isArray(styles)) {
    const style = styles.map(s => s.content).join('\n');
    this.emitFile(`${pageName}.acss`, style);
  }

  if (template) {
    const { template: tpl, metadata } = transpiler(template.content, {
      tplImports,
    });
    Object.assign(tplPropsData, metadata.propsDataMap);

    this.emitFile(`${pageName}.axml`, tplDeps.join('\n') + tpl);
  }

  let source = 'Page({});';

  if (script) {
    const deps = Object.keys(tplImports)
      .map(tagName => {
        const { tplName, filename, configPath } = tplImports[tagName];
        return `'${tplName}': {
            config: require('/${configPath}'),
            propsData: ${
  tplPropsData[tplName]
    ? JSON.stringify(tplPropsData[tplName])
    : '{}'
},
          },`;
      })
      .join('\n');
    source = [
      `var pageConfig = require('/${OUTPUT_SOURCE_FOLDER}/${pageName}');`,
      `var createPage = require('/${OUTPUT_VENDOR_FOLDER}/createPage');`,
      `Page(createPage(pageConfig, {${deps}}));`,
    ].join('\n');

    const { code, map } = compileES5(script.content, {
      sourceMaps: true,
      plugins: [
        function() {
          return {
            visitor: {
              ImportDeclaration(path) {
                if (
                  path.node.source &&
                  path.node.source.type === 'StringLiteral'
                ) {
                  // path.node.source.value = `/${OUTPUT_SOURCE_FOLDER}/components/title`;
                }
              },
            },
          };
        },
      ],
    });
    this.emitFile(
      `${OUTPUT_SOURCE_FOLDER}/${pageName}.js`,
      code,
      map
    );
  }
  this.callback(null, source);
};
