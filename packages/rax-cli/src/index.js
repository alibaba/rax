var generate = require('./generator');

/**
 * kwargs {Object}
 * @param  {String} root [The absolute path of project directory]
 * @param  {String} directoryName [The folder name]
 * @param  {String} projectName [Kebabcased project name]
 * @param  {String} projectAuthor [The name of project author]
 * @param  {Boolean} verbose [enable verbose mode]
 * @param  {String} rwPackage [argv.version]
 */
function init(kwargs) {
  generate(kwargs);
}

module.exports = {
  init: init,
};
