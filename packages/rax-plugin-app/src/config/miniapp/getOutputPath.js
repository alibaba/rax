const path = require('path');

module.exports = (context) => {
  const { rootDir, userConfig } = context;
  const { outputDir } = userConfig;
  const outputPath = path.resolve(rootDir, 'build-miniapp');

  return outputPath;
};
