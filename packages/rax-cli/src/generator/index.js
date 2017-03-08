var path = require('path');
var chalk = require('chalk');
var fs = require('fs');
var spawn = require('cross-spawn');
var easyfile = require('easyfile');

module.exports = function(kwargs) {
  var projectDir = kwargs.root;
  var projectName = kwargs.projectName;
  var projectAuthor = kwargs.projectAuthor;

  var src = path.join(__dirname, 'templates');
  var pkgPath = path.join(projectDir, 'package.json');
  easyfile.copy(src, projectDir, {
    force: true,
    backup: true,
  });

  var replacedPkg = fs.readFileSync(pkgPath, 'utf-8')
    .replace('__YourProjectName__', projectName)
    .replace('__AuthorName__', projectAuthor);
  fs.writeFileSync(pkgPath, replacedPkg);

  process.chdir(projectDir);
  return Promise.resolve(projectDir);
};
