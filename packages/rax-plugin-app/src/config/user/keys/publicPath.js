module.exports = (config, context, value) => {
  const { command } = context;

  if (command === 'build') {
    config.output.publicPath(value);
  }
};
