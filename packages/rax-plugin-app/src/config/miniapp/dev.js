const fs = require('fs-extra');
const jsx2mp = require('jsx2mp-cli');

const getOutputPath = require('./getOutputPath');

module.exports = (context, devCompileLog) => {
  const outputPath = getOutputPath(context);
  fs.removeSync(outputPath);

  jsx2mp.watch({
    webpackConfig: {
      output: {
        path: outputPath
      }
    },
    afterCompiled: (err, stats) => {
      devCompileLog({
        err,
        stats,
      });
    }
  });
};
