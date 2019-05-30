const { dirname, isAbsolute, join } = require('path');
const createGenerate = require('./createGenerator');
const createParse = require('./createParser');
const { createAdapter } = require('./adapter');

module.exports = function transpiler(content, opts) {
  const { templatePath, type } = opts;
  let dependencies = [];
  // create adapter
  createAdapter(type);
  const modules = require('./transformModules');
  const parse = createParse(modules);
  const generate = createGenerate(modules);
  const templateAST = parse(content.trim(), opts);


  if (Array.isArray(templateAST.templates)) {
    templateAST.templates
      .map(resolveImportTemplate)
      .forEach((tplPath) => {
        dependencies.push(tplPath);
      });
  }

  const { render, ast } = generate(templateAST, opts);

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
