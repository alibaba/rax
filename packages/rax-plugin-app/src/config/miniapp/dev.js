const fs = require('fs-extra');
const jsx2mp = require('jsx2mp-cli');

const getOutputPath = require('./getOutputPath');

module.exports = (context, devCompileLog) => {
  const outputPath = getOutputPath(context);
  fs.removeSync(outputPath);

  jsx2mp.watch({
    entry: 'src/app',
    type: 'project',
    workDirectory: process.cwd(),
    distDirectory: outputPath,
    enableWatch: true,
    platform: 'ali',
    afterCompiled: (err, stats) => {
      devCompileLog({
        err,
        stats,
      });
    }
  });
};
