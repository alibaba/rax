const fs = require('fs-extra');
const path = require('path');

module.exports = (context) => {
  const { rootDir, userConfig } = context;
  const { outputDir } = userConfig;
  const output = path.resolve(rootDir, outputDir);
  fs.ensureDirSync(output);
  const outputPath = path.resolve(output, 'miniapp');

  return outputPath;
};
