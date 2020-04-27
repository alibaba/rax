function isNpmModule(value) {
  return !(value[0] === '.' || value[0] === '/');
}

module.exports = {
  isNpmModule
};
