var generate = require('./generator');

/**
 * The entry of init.
 * @param  {Object} kwargs - describe the init arguements
 * @param  {String} kwargs.root - The absolute path of project directory
 * @param  {String} kwargs.directoryName - The folder name
 * @param  {String} kwargs.projectName - Kebabcased project name
 * @param  {String} kwargs.projectAuthor - The name of project author
 * @param  {Boolean} kwargs.verbose - enable verbose mode
 * @param  {String} kwargs.rwPackage - argv.version
 * @return {Promise}
 */
function init(kwargs) {
  return generate(kwargs);
}

module.exports = {
  init: init,
};
