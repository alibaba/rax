const { dirname, isAbsolute, join } = require('path');
const { readFileSync, existsSync } = require('fs');
const { parse } = require('./parser');
const generate = require('./generate');
const { compileToES5 } = require('../shared/utils');

module.exports = function transpiler(content, opts) {
  const templateAST = parse(content.trim(), opts);
  const { templatePath } = opts;
  let dependencies = [];
  let hasStyle = false;
  let stylePath = templatePath.replace(/\.(\w+)$/, opts.type === 'wx' ? '.wxss' : '.acss');
  if (existsSync(stylePath)) {
    hasStyle = true;
  }

  if (Array.isArray(templateAST.templates)) {
    templateAST.templates
      .map(resolveImportTemplate)
      .forEach((tplPath) => {
        dependencies.push(tplPath);
      });
  }

  const { render, ast } = generate(templateAST, {});
  /**
   * support object spread stynax in template
   * https://new.babeljs.io/docs/en/next/babel-plugin-proposal-object-rest-spread.html
   */
  const { code } = compileToES5(render, {
    presets: [],
    plugins: [
      [
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
        {
          loose: true,
          useBuiltIns: true
        }
      ]
    ]
  });

  return {
    renderFn: code,
    ast,
    dependencies,
    tplAlias: ast.tplAlias || null,
    tplASTs: ast.tplASTs || null,
    stylePath: hasStyle ? stylePath : null
  };

  function resolveImportTemplate(importPath) {
    if (!isAbsolute(importPath)) {
      importPath = join(dirname(templatePath), importPath);
    }
    return importPath;
  }
};
