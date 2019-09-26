const WEEX_MODULE_REG = /^@weex(-module)?\//;

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
  isNpmModule,
  isWeexModule,
  isRaxModule
};
