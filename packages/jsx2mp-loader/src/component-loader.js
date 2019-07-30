const { readFileSync } = require('fs-extra');

module.exports = function componentLoader(content) {
  const rawContent = readFileSync(this.resourcePath);


  return content;
}
