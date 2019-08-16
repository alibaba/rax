const fs = require('fs-extra');
const jsx2mp = require('jsx2mp-cli');
const path = require('path');

const getOutputPath = require('./getOutputPath');

module.exports = (context, devCompileLog) => {
  const outputPath = getOutputPath(context);

  fs.removeSync(outputPath);

  return new Promise(resolve => {
    jsx2mp.build({
      entry: 'src/index',
      type: 'component',
      workDirectory: path.resolve(process.cwd()),
      distDirectory: outputPath,
      enableWatch: false,
      // platform: 'ali',
      platform: {
        type: 'ali',
        extension: {
          xml: 'axml',
          css: 'acss',
        }
      },
      afterCompiled: (err, stats) => {
        resolve({
          err,
          stats,
        });
      }
    });
  });
};
