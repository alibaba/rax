const ejs = require('ejs');
const path = require('path');
const TemplateProcesser = require('./template-processer');

// Rename files start with '_'
function renameFile(files) {
  files.forEach(file => {
    file.name = file.name.replace(/^_/, '.');
  });
}

// Render ejs template
function ejsRender(data) {
  return (files) => {
    files.forEach(file => {
      file.content = ejs.render(file.content, data);
    });
  };
}

function processPackageJson(files) {
  const pkgIndex = files.findIndex(file => file.name === 'package.json');
  const ejsPkgIndex = files.findIndex(file => file.name === '_package.json');
  if (ejsPkgIndex !== 1) {
    // rename _package.json
    files[ejsPkgIndex].name = files[ejsPkgIndex].name.replace(/^_/, '');
    if (pkgIndex !== -1) {
      // delete package.json when _package.json exists.
      files.splice(pkgIndex, 1);
    }
  }
  return files;
}

/**
 * Template generator.
 * @param  {Object} args - describe the generator arguements
 * @param  {String} args.root - The absolute path of project directory
 * @param  {String} args.directoryName - The folder name
 * @param  {String} args.projectName - Kebabcased project name
 * @param  {String} args.projectType - Kebabcased project type
 * @param  {String} args.projectAuthor - The name of project author
 * @param  {String} args.projectTargets- The build targets of project
 * @param  {String} args.projectFeatures- The features of project
 * @return {Promise}
 */
module.exports = function(args) {
  const projectDir = args.root;
  const projectType = args.projectType;

  const templates = path.join(__dirname, projectType);

  new TemplateProcesser(templates)
    .use(processPackageJson)
    .use(renameFile)
    .use(ejsRender(args))
    .done(projectDir);

  process.chdir(projectDir);
  return Promise.resolve(projectDir);
};
