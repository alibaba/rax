var generate = require('./generator');

function init(kwargs) {
  generate(kwargs);
}

module.exports = {
  init: init,
};
