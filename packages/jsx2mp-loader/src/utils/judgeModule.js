const { extname } = require('path');

const WEEX_MODULE_REG = /^@?weex-/;
const JSX2MP_RUNTIME_MODULE_REG = /^jsx2mp-runtime/;

function isNpmModule(value) {
  return !(value[0] === '.' || value[0] === '/');
}

function isWeexModule(value) {
  return WEEX_MODULE_REG.test(value);
}

function isRaxModule(value) {
  return value === 'rax';
}

function isJsx2mpRuntimeModule(value) {
  return JSX2MP_RUNTIME_MODULE_REG.test(value);
}

function isNodeNativeModule(value) {
  return process.binding('natives').hasOwnProperty(value);
}

function isJSONFile(value) {
  return extname(value) === '.json';
}

function isTypescriptFile(value) {
  return extname(value) === '.ts' || extname(value) === '.tsx';
}

module.exports = {
  isNpmModule,
  isWeexModule,
  isRaxModule,
  isJsx2mpRuntimeModule,
  isNodeNativeModule,
  isJSONFile,
  isTypescriptFile
};
