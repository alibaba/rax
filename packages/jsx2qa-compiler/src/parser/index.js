const t = require('@babel/types');
const babelParser = require('@babel/parser');
const invokeModules = require('../utils/invokeModules');
const traverse = require('../utils/traverseNodePath');
const getDefaultExportedPath = require('../utils/getDefaultExportedPath');
const getProgramPath = require('../utils/getProgramPath');
const parserOption = require('./option');
const md5 = require('md5');

const RELATIVE_COMPONENTS_REG = /^\..*(\.jsx?)?$/i;

function getTagName(str) {
  return 'c-' + md5(str).slice(0, 6);
}

/**
 * Parse JS code by babel parser.
 * @param code {String} JS code.
 */
function parseCode(code) {
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
        const ret = { local, default: t.isImportDefaultSpecifier(specifier), namespace: t.isImportNamespaceSpecifier(specifier) };
        if (ret.default === false && ret.namespace === false) {
          ret.importFrom = specifier.imported.name;
        }

        if (RELATIVE_COMPONENTS_REG.test(source)) {
          // alias = 'c-xxxxx'
          ret.name = getTagName(source);
          ret.isCustomEl = true;
        } else {
          // alias = 'rax-view'
          ret.name = source;
          ret.isCustomEl = false;
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
      if (node.declaration !== null) {
        switch (node.declaration.type) {
          case 'ClassDeclaration':
          case 'FunctionDeclaration':
            exported.push(node.declaration.id.name);
            break;
          case 'VariableDeclaration':
            if (node.declaration.declarations.length > 0) {
              node.declaration.declarations.forEach((declarator) => {
                exported.push(declarator.id.name);
              });
            }
            break;
        }
      }
      if (t.isIdentifier(node.name)) {
        exported.push(node.name.name);
      }
    },
  });
  return exported;
}

/**
 * @param code
 * @param options {Object} Parser options.
 */
function parse(code, options) {
  if (!options) {
    const { baseOptions } = require('../options');
    options = baseOptions;
  }

  const ast = parseCode(code);
  const imported = getImported(ast);
  const exported = getExported(ast);
  const programPath = getProgramPath(ast);
  const defaultExportedPath = getDefaultExportedPath(ast);

  const ret = {
    ast,
    imported,
    exported,
    defaultExportedPath,
    programPath,
    assets: {},
  };

  // Reverse to call parse.
  invokeModules(reverse(options.modules), 'parse', ret, code, options);
  return ret;
}

function parseExpression(code) {
  return parseCode(code).program.body[0].expression;
}

/**
 * Reverse an array without effects.
 */
function reverse(arr) {
  const copied = Array.prototype.slice.call(arr);
  return copied.reverse();
}

exports.parse = parse;
exports.parseCode = parseCode;
exports.parseExpression = parseExpression;
exports.getImported = getImported;
exports.getExported = getExported;
