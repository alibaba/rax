const WEEX_MODULE_REG = /^@?weex-/;

function isWeexModule(value) {
  return WEEX_MODULE_REG.test(value);
}

function isNpmModule(value) {
  return !(value[0] === '.' || value[0] === '/');
}

module.exports = {
  isWeexModule,
  isNpmModule
};
