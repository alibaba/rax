const path = require('path');
const rimraf = require('rimraf');
const {
  getNpmTarball,
  getAndExtractTarball,
} = require('ice-npm-utils');
const generate = require('./generator');
const config = require('./config');

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
   * export global config
   */
  config,

  /**
   * The entry of init.
   * @param  {Object} args - describe the init arguements
   * @param  {String} args.root - The absolute path of project directory
   * @param  {String} args.projectName - Kebabcased project name
   * @param  {String} args.projectType - Kebabcased project type
   * @param  {String} args.projectAuthor - The name of project author
   * @param  {Array} args.projectTargets- The build targets of project
   * @param  {Array} args.projectFeatures- The features of project
   * @return {Promise}
   */
  init(args) {
    const defaultInfo = {
      root: process.cwd(),
      projectName: '',
      projectAuthor: '',
      projectType: 'scaffold',
      projectTargets: ['web'],
      projectFeatures: [],
    };
    const projectInfo = Object.assign({}, defaultInfo, args);
    const template = projectInfo.template || 'rax-template';

    // template is a local path
    if (/^(\/|\.)/.test(template)) {
      // current work dir is projectInfo.root
      const templatePath = path.resolve('../', template, 'template', projectInfo.projectType);

      return generate(templatePath, projectInfo).then(res => {
        return res;
      });
    } else {
      const downloadPath = path.join(projectInfo.root, '.rax-cli-template');
      const templatePath = path.join(downloadPath, 'template', projectInfo.projectType);

      rimraf.sync(downloadPath);

      return downloadTemplate(template, downloadPath).then(() => {
        return generate(templatePath, projectInfo).then(res => {
          rimraf.sync(downloadPath);
          return res;
        });
      });
    }
  }
};
