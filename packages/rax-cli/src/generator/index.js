var path = require('path');
var chalk = require('chalk');
var fs = require('fs');
var spawn = require('cross-spawn');
var easyfile = require('easyfile');
var path = require('path');

module.exports = function(kwargs) {
  var projectDir = kwargs.root;
  var projectName = kwargs.projectName;
  var projectAuthor = kwargs.projectAuthor;

  var templates = path.join(__dirname, 'templates');
  var pkgPath = path.join(projectDir, 'package.json');
  easyfile.copy(templates, projectDir, {
    force: true,
    backup: true,
  });

  // Rename files start with '_'
  var files = easyfile.readdir(projectDir);
  files.forEach(function(filename) {
    if (filename[0] === '_') {
      var filepath = path.join(projectDir, filename);
      easyfile.rename(
        path.join(projectDir, filename),
        path.join(projectDir, filename.replace(/^_/, '.'))
      );
    }
  });

  var replacedPkg = fs.readFileSync(pkgPath, 'utf-8')
    .replace('__YourProjectName__', projectName)
    .replace('__AuthorName__', projectAuthor);
  fs.writeFileSync(pkgPath, replacedPkg);

  process.chdir(projectDir);
  return Promise.resolve(projectDir);
};
