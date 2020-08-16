/**
 * script to build (transpile) files.
 * By default it transpiles all files for all packages and writes them
 * into `lib/` directory.
 * Non-js or files matching IGNORE_PATTERN will be copied without transpiling.
 *
 * Example:
 *  compile all packages: node ./scripts/compile-packages.js
 *  watch compile some packages: node ./scripts/compile-packages.js --watch --packages rax,rax-cli
 */
'use strict';

const compile = require('./compile');

compile('packages');
compile('packages', true);
