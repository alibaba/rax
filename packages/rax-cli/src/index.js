const generate = require('./generator');

module.exports = {
  /**
   * The entry of init.
   * @param  {Object} args - describe the init arguements
   * @param  {String} args.root - The absolute path of project directory
   * @param  {String} args.projectName - Kebabcased project name
   * @param  {String} args.projectType - Kebabcased project type
   * @param  {String} args.projectAuthor - The name of project author
   * @param  {String} args.projectTargets- The build targets of project
   * @param  {String} args.projectFeatures- The features of project
   * @return {Promise}
   */
  init(args) {
    return generate(args);
  }
};
