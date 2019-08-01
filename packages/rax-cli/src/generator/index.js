const ejs = require('ejs');
const path = require('path');
const TemplateProcesser = require('./template-processer');

// Rename files start with '_'
function renameFile (files) {
  files.forEach(file => {
    if (file.name[0] === '_') {
      file.name = file.name.replace(/^_/, '.');
    }
  })
}

// Render ejs template
function ejsRender(data) {
  return (files) => {
    files.forEach(file => {
      file.content = ejs.render(file.content, data);
    })
  }
}

module.exports = function(args) {
  const projectDir = args.root;
  const projectType = args.projectType;

  const templates = path.join(__dirname, projectType);

  new TemplateProcesser(templates)
    .use(renameFile)
    .use(ejsRender(args))
    .done(projectDir);

  process.chdir(projectDir);
  return Promise.resolve(projectDir);
};
