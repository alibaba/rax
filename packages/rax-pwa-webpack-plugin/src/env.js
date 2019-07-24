const isProductionMode = (compiler) => {
  return compiler.options.mode === 'production' || !compiler.options.mode;
};

module.exports = { isProductionMode };
