module.exports = (config, context, value) => {
  const { command } = context;

  if (command === 'dev') {
    config.merge({ devServer: value });
  }
};
