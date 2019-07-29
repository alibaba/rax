var fs = require('fs');
var easyfile = require('easyfile');
var path = require('path');

var processPWAProject = (projectDir, projectFeatures, replacedPkg) => {
  var appJSON;
  if (projectFeatures && projectFeatures.length) {
    fs.unlinkSync(path.join(projectDir, 'src/index.js'));
    fs.unlinkSync(path.join(projectDir, 'public/index.html'));
    fs.rmdirSync(path.join(projectDir, 'public'));

    var appJSONPath = path.join(projectDir, 'app.json');
    var appJSONContent = fs.readFileSync(appJSONPath, 'utf-8');
    appJSON = JSON.parse(appJSONContent);

    projectFeatures.forEach((feature) => {
      appJSON[feature] = true;
    });

    var jsonString = JSON.stringify(appJSON, null, 2) + '\n';
    fs.writeFileSync(appJSONPath, jsonString, 'utf-8');
  }

  if (appJSON && appJSON.spa) {
    // SPA
    var spaIndexPath = path.join(projectDir, 'src/pages/index/index.spa.js');
    fs.writeFileSync(path.join(projectDir, 'src/pages/index/index.js'), fs.readFileSync(spaIndexPath, 'utf-8'), 'utf-8');
    fs.unlinkSync(spaIndexPath);
    var packageJSON = JSON.parse(replacedPkg);
    packageJSON.dependencies['rax-pwa'] = '^1.0.0';
    replacedPkg = JSON.stringify(packageJSON, null, 2) + '\n';
  } else {
    fs.unlinkSync(path.join(projectDir, 'src/pages/about/index.js'));
    fs.rmdirSync(path.join(projectDir, 'src/pages/about'));
    fs.unlinkSync(path.join(projectDir, 'src/pages/index/index.spa.js'));
  }

  return replacedPkg;
};

module.exports = function(args) {
  var projectDir = args.root;
  var projectName = args.projectName;
  var projectAuthor = args.projectAuthor;
  var projectType = args.projectType;
  var projectFeatures = args.projectFeatures;

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
  if (projectType === 'webapp') {
    replacedPkg = processPWAProject(projectDir, projectFeatures, replacedPkg);
  }
  fs.writeFileSync(pkgPath, replacedPkg);

  process.chdir(projectDir);
  return Promise.resolve(projectDir);
};
