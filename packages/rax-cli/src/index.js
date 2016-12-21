var generate = require('./generator');

function init(projectDir, projectName, verbose) {
  generate(projectDir, projectName, verbose);
}

module.exports = {
  init: init,
};
