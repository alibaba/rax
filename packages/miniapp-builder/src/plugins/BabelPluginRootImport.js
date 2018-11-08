const path = require('path');

const root = process.cwd();

function RootImportPlugin({ types: t }) {
  const visitor = {
    CallExpression: function CallExpression(path, state) {
      if (path.node.callee.name !== 'require') {
        return;
      }

      let args = path.node.arguments;
      if (!args.length) {
        return;
      }

      let firstArg = traverseExpression(t, args[0]);

      if (firstArg) {
        firstArg.value = replacePrefix(firstArg.value, state.opts, state.file.opts.filename);
      }
    },
    ImportDeclaration: function ImportDeclaration(path, state) {
      path.node.source.value = replacePrefix(path.node.source.value, state.opts, state.file.opts.filename);
    },
    ExportNamedDeclaration: function ExportNamedDeclaration(path, state) {
      if (path.node.source) {
        path.node.source.value = replacePrefix(path.node.source.value, state.opts, state.file.opts.filename);
      }
    },
    ExportAllDeclaration: function ExportAllDeclaration(path, state) {
      if (path.node.source) {
        path.node.source.value = replacePrefix(path.node.source.value, state.opts, state.file.opts.filename);
      }
    }
  };
  return {
    'visitor': {
      Program: function Program(path, state) {
        path.traverse(visitor, state);
      }
    }
  };
}


function replacePrefix(path, opts = [], sourceFile) {
  const options = [].concat(opts);

  for (let i = 0; i < options.length; i++) {
    let rootPathSuffix = '';
    let rootPathPrefix = '';
    let option = options[i];

    if (option.rootPathSuffix && typeof option.rootPathSuffix === 'string') {
      rootPathSuffix = option.rootPathSuffix;
    }
    if (option.rootPathPrefix && typeof option.rootPathPrefix === 'string') {
      rootPathPrefix = option.rootPathPrefix;
    } else {
      rootPathPrefix = '~';
    }

    if (hasRootPathPrefixInString(path, rootPathPrefix)) {
      return transformRelativeToRootPath(path, rootPathSuffix, rootPathPrefix, sourceFile);
    }
  }

  return path;
}


/**
 * Recursively traverses binary  expressions to find the first `StringLiteral` if any.
 * @param  {Object} t           Babel types
 * @param  {Node} arg           a Babel node
 * @return {StringLiteral?}
 */
function traverseExpression(t, arg) {
  if (t.isStringLiteral(arg)) {
    return arg;
  }

  if (t.isBinaryExpression(arg)) {
    return traverseExpression(t, arg.left);
  }

  return null;
}

function hasRootPathPrefixInString(importPath, rootPathPrefix = '~') {
  let containsRootPathPrefix = false;
  if (typeof importPath === 'string') {
    if (importPath.substring(0, 1) === rootPathPrefix) {
      containsRootPathPrefix = true;
    }
    let firstTwoCharactersOfString = importPath.substring(0, 2);
    if (firstTwoCharactersOfString === rootPathPrefix + '/') {
      containsRootPathPrefix = true;
    }
  }
  return containsRootPathPrefix;
}

function transformRelativeToRootPath(importPath, rootPathSuffix, rootPathPrefix, sourceFile = '') {
  sourceFile = slash(sourceFile);
  let withoutRootPathPrefix = '';
  if (hasRootPathPrefixInString(importPath, rootPathPrefix)) {
    if (importPath.substring(0, 1) === '/') {
      withoutRootPathPrefix = importPath.substring(1, importPath.length);
    } else {
      withoutRootPathPrefix = importPath.substring(2, importPath.length);
    }
    let absolutePath = path.resolve((rootPathSuffix ? rootPathSuffix : './') + '/' + withoutRootPathPrefix);
    let sourcePath = sourceFile.substring(0, sourceFile.lastIndexOf('/'));
    // if the path is an absolute path (webpack sends '/Users/foo/bar/baz.js' here)
    if (sourcePath.indexOf('/') === 0 || sourcePath.indexOf(':/') === 1 || sourcePath.indexOf(':\\') === 1) {
      sourcePath = sourcePath.substring(root.length + 1);
    }
    sourcePath = path.resolve(sourcePath);
    let relativePath = slash(path.relative(sourcePath, absolutePath));
    // if file is located in the same folder
    if (relativePath.indexOf('../') !== 0) {
      relativePath = './' + relativePath;
    }
    // if the entry has a slash, keep it
    if (importPath[importPath.length - 1] === '/') {
      relativePath += '/';
    }
    return relativePath;
  }
  if (typeof importPath === 'string') {
    return importPath;
  }
  throw new Error('ERROR: No path passed');
}

/**
 * Convert Windows backslash paths to slash paths: `foo\\bar` -> `foo/bar`
 */
function slash(str) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(str);
  const hasNonAscii = /[^\x00-\x80]+/.test(str);

  if (isExtendedLengthPath || hasNonAscii) {
    return str;
  }

  return str.replace(/\\/g, '/');
}

module.exports = RootImportPlugin;
