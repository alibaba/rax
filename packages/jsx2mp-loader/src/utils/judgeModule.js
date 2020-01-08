const { sep } = require('path');

const WEEX_MODULE_REG = /^@?weex-/;
const JSX2MP_RUNTIME_MODULE_REG = /^jsx2mp-runtime/;

function isNpmModule(value) {
  return !(value[0] === '.' || value[0] === sep);
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

module.exports = {
  isNpmModule,
  isWeexModule,
  isRaxModule,
  isJsx2mpRuntimeModule
};
