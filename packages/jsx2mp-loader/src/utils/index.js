const { extname } = require('path');

const WEEX_MODULE_REG = /^@weex(-module)?\//;

function removeExt(path) {
  const ext = extname(path);
  return path.slice(0, path.length - ext.length);
}

function isNpmModule(value) {
  return !(value[0] === '.' || value[0] === '/');
}

function isWeexModule(value) {
  return WEEX_MODULE_REG.test(value);
}

function isRaxModule(value) {
  return value === 'rax';
}

module.exports = {
  removeExt,
  isNpmModule,
  isWeexModule,
  isRaxModule
};
