const { writeFile } = require('../utils/file');
const compiler = require('jsx-compiler');
const { readFileSync } = require('fs-extra');

/**
 * Write files
 * @param distPath {String} dist Path
 * @param transformed {Object} jsx to miniapp object.
 * @param rootContext {String} root Path
 */
const writeFiles = function(distPath, transformed, rootContext) {
  writeFile(distPath + '.axml', transformed.template, rootContext);
  writeFile(distPath + '.json', JSON.stringify(transformed.config, null, 2) + '\n', rootContext);
  writeFile(distPath + '.js', transformed.code, rootContext);
  writeFile(distPath + '.acss', transformed.style, rootContext);
};

/**
 * Read jsx file & transform jsx code by compiler
 * @param sourcePath {String} source Path
 * @param type {String} transform file type
 */
const transformJSX = function(sourcePath, type) {
  const jsxFileContent = readFileSync(sourcePath, 'utf-8');
  const transformed = compiler(jsxFileContent, Object.assign({}, compiler.baseOptions, {
    filePath: sourcePath,
    type: type,
  }));
  return transformed;
};

module.exports = {
  transformJSX,
  writeFiles
};