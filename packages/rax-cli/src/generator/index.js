var fs = require('fs');
var easyfile = require('easyfile');
var path = require('path');

module.exports = function(args) {
  var projectDir = args.root;
  var projectName = args.projectName;
  var projectAuthor = args.projectAuthor;
  var projectType = args.projectType;

  var templates = path.join(__dirname, projectType);
  var pkgPath = path.join(projectDir, 'package.json');
  easyfile.copy(templates, projectDir, {
    force: true,
    backup: true,
  });

  // Rename files start with '_'
  var files = easyfile.readdir(projectDir);
  files.forEach(function(filename) {
    if (filename[0] === '_') {
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
