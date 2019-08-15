const fs = require('fs-extra');
const jsx2mp = require('jsx2mp-cli');
const path = require('path');

const getOutputPath = require('./getOutputPath');

module.exports = (context, devCompileLog) => {
  const outputPath = getOutputPath(context);

  fs.removeSync(outputPath);

  jsx2mp.watch({
    entry: 'src/miniapp/index',
    type: 'component',
    workDirectory: path.resolve(process.cwd()),
    distDirectory: outputPath,
    enableWatch: true,
    // platform: 'ali',
    platform: {
      type: 'ali',
      extension: {
        xml: 'axml',
        css: 'acss',
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
