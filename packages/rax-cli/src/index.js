var generate = require('./generator');

module.exports = {
  /**
   * The entry of init.
   * @param  {Object} args - describe the init arguements
   * @param  {String} args.root - The absolute path of project directory
   * @param  {String} args.directoryName - The folder name
   * @param  {String} args.projectName - Kebabcased project name
   * @param  {String} args.projectType - Kebabcased project type
   * @param  {String} args.projectAuthor - The name of project author
   * @return {Promise}
   */
  init(args) {
    return generate(args);
  }
};
