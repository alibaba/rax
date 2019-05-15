#!/usr/bin/env node

const { readFileSync, writeFileSync } = require('fs-extra');
const { join } = require('path');
const compiler = require('../');

const cwd = process.cwd();
const args = process.argv.slice(2);
const filePath = require.resolve(join(cwd, args[0]));
const code = getFileContent(filePath);

const ret = compiler(code, { filePath, rootContext: cwd });

console.log(ret);


/**
 * Get file content as utf-8 text.
 * @param path {String} Absolute path to a text file.
 */
function getFileContent(path) {
  return readFileSync(path, 'utf-8');
}
