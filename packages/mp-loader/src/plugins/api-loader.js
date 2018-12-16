module.exports = function APILoader(content) {


  return `
    module.exports = require('${this.resourcePath}');
    debugger;
  `;
}
