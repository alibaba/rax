const { readFileSync } = require('fs-extra');

module.exports = function fileLoader(content) {
  const rawContent = readFileSync(this.resourcePath);


  return content;
}
