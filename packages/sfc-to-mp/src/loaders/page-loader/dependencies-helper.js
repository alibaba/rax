const path = require('path');

module.exports = {
  getTemplateImportPath(targetPath, outputPath) {
    let releatedPath = path.relative(path.dirname(targetPath), outputPath);
    releatedPath = releatedPath.startsWith('.') ? releatedPath : './' + releatedPath;
    console.log(targetPath);
    console.log(outputPath);
    console.log(releatedPath);
    return `<import src="${releatedPath}" />`;
  },
};
