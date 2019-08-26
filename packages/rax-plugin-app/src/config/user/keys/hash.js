const path = require('path');

module.exports = (config, context, value) => {
  // default is false
  if (value) {
    const hashStr = typeof value === 'boolean' ? 'hash:6' : value;

    const fileName = config.output.get('filename');
    let pathArray = fileName.split('/');
    pathArray.pop();
    pathArray = pathArray.filter((v) => v);

    const outputPath = pathArray.length ? pathArray.join('/') : '';
    config.output.filename(path.join(outputPath, `[name].[${hashStr}].js`));

    if (config.plugins.has('minicss')) {
      config.plugin('minicss').tap((args) => {
        args[0].filename = path.join(outputPath, `[name].[${hashStr}].css`);
        return args;
      });
    }
  }
};
