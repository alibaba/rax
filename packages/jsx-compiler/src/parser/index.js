const t = require('@babel/types');
const babelParser = require('@babel/parser');
const invokeModules = require('../utils/invokeModules');
const traverse = require('../utils/traverseNodePath');
const parserOption = require('./option');
const { baseOptions } = require('../options');

/**
 * Parse JS code by babel parser.
 * @param code {String} JS code.
 */
function astParser(code) {
  return babelParser.parse(code, parserOption);
}

/**
 * Get imported modules.
 * @param ast
 */
function getImported(ast) {
  // { [source]: [{ local: String, imported: String, default: Boolean } }]
  const imported = {};
  traverse(ast, {
    ImportDeclaration(path) {
      const { specifiers } = path.node;
      if (!Array.isArray(specifiers)) return;
      const source = path.node.source.value;
      imported[source] = [];

      path.node.specifiers.forEach((specifier) => {
        const local = specifier.local.name;
        const ret = { local, default: t.isImportDefaultSpecifier(specifier) };
        if (ret.default === false) {
          ret.importFrom = specifier.imported.name;
        }
        imported[source].push(ret);
      });
    },
  });
  return imported;
}

/**
 * Get exported modules.
 * @param ast
 */
function getExported(ast) {
  // { [localId]: { source: String, importFrom: String, default: Boolean } }
  const exported = [];
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      exported.push('default');
    },
    ExportNamedDeclaration(path) {
      const { node } = path;
      if (node.specifiers.length > 0) {
        node.specifiers.forEach((specifier) => {
          exported.push(specifier.local.name);
        });
      }
      exported.push(path.node.name.name);
    },
  });
  return exported;
}

/**
 * Get default exported path.
 * @param ast
 */
function getDefaultExportedPath(ast) {
  let exportedDeclaration = null;
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      exportedDeclaration = path.get('declaration');
    },
  });
  return exportedDeclaration;
}

/**
 * @param code
 * @param options {Object} Parser options.
 */
function parse(code, options = baseOptions) {
  const ast = astParser(code);
  const imported = getImported(ast);
  const exported = getExported(ast);
  const defaultExportedPath = getDefaultExportedPath(ast);

  const ret = {
    ast,
    imported,
    exported,
    defaultExportedPath,
  };

  // Reverse to call parse.
  invokeModules(options.modules.reverse(), 'parse', ret, code, options);

  return ret;
}

exports.parse = parse;
