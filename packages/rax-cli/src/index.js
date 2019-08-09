const path = require('path');
const rimraf = require('rimraf');
const {
  getNpmTarball,
  getAndExtractTarball,
} = require('ice-npm-utils');
const generate = require('./generator');

/**
 * download project template from npm
 * @param {String} template template name
 * @param {String} destPath download path
 * @return {Promise}
 */
function downloadTemplate(template, destPath) {
  return getNpmTarball(template).then(tarball => {
    return getAndExtractTarball(destPath, tarball);
  });
}

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
    const downloadPath = path.join(args.root, '.rax-cli-template');
    const templatePath = path.join(downloadPath, 'template', args.projectType);

    rimraf.sync(downloadPath);

    return downloadTemplate('rax-template', downloadPath).then(() => {
      return generate(templatePath, args).then(res => {
        rimraf.sync(downloadPath);
        return res;
      });
    });
  }
};
