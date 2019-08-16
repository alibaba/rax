const fs = require('fs-extra');
const jsx2mp = require('jsx2mp-cli');

const getOutputPath = require('./getOutputPath');

module.exports = (context) => {
  const outputPath = getOutputPath(context);
  fs.removeSync(outputPath);

  return new Promise((resolve) => {
    jsx2mp.build({
      entry: 'src/app',
      type: 'project',
      workDirectory: context.rootDir,
      distDirectory: outputPath,
      enableWatch: false,
      platform: 'ali',
      afterCompiled: (err, stats) => {
        resolve({
          err,
          stats,
        });
      }
    });
  });
};
