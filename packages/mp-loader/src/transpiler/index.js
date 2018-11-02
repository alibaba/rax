const { dirname, isAbsolute, join } = require('path');
const { parse } = require('./parser');
const generate = require('./generate');

module.exports = function transpiler(content, opts) {
  const templateAST = parse(content.trim(), opts);
  const { templatePath } = opts;
  let dependencies = [];

  if (Array.isArray(templateAST.templates)) {
    templateAST.templates
      .map(resolveImportTemplate)
      .forEach((tplPath) => {
        dependencies.push(tplPath);
      });
  }

  const { render, ast } = generate(templateAST, {});

  return {
    renderFn: render,
    ast,
    dependencies,
    tplAlias: ast.tplAlias || null,
    tplASTs: ast.tplASTs || null
  };

  function resolveImportTemplate(importPath) {
    if (!isAbsolute(importPath)) {
      importPath = join(dirname(templatePath), importPath);
    }
    return importPath;
  }
};
