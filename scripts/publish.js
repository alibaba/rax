/**
 * Example:
 *  node ./scripts/publish.js 1.0.0 --force-publish=*
 */
'use strict';

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const spawnSync = require('child_process').spawnSync;
const version = process.argv[2];
const forcePublish = process.argv[3] || '';
const EXAMPLES_DIR = path.resolve(__dirname, '../examples');

function getExamplesHtmlEntry() {
  let entry = [];

  fs.readdirSync(EXAMPLES_DIR)
    .forEach(file => {
      let f = path.resolve(EXAMPLES_DIR, file, 'index.html');
      if (fs.existsSync(f)) {
        entry.push(f);
      }
    });

  return entry;
}

if (version) {
  const semver = '^' + version;

  console.log('Update rax version file to', version);
  const RAX_VERSION_FILE = 'packages/rax/src/version.js';
  fs.writeFileSync(RAX_VERSION_FILE, 'export default \'' + version + '\';\n');

  console.log('Update dependencies in package.json');
  const GENERATOR_DEPENDENCIES_FILE = path.resolve(__dirname, '../packages/rax-cli/src/generator/templates/package.json');
  const JSONString = fs.readFileSync(GENERATOR_DEPENDENCIES_FILE);
  const packageJSON = JSON.parse(JSONString);
  packageJSON.dependencies.rax = semver;
  packageJSON.dependencies['rax-components'] = semver;
  packageJSON.devDependencies['babel-preset-rax'] = semver;
  packageJSON.devDependencies['rax-webpack-plugin'] = semver;
  packageJSON.devDependencies['stylesheet-loader'] = semver;
  fs.writeFileSync(GENERATOR_DEPENDENCIES_FILE, JSON.stringify(packageJSON, null, '  '));
  console.log('*', GENERATOR_DEPENDENCIES_FILE);

  const PROJECT_DEPENDENCIES_FILE = path.resolve(__dirname, '../package.json');
  const ProjectPackageJSON = JSON.parse(fs.readFileSync(PROJECT_DEPENDENCIES_FILE));
  ProjectPackageJSON.devDependencies['babel-preset-rax'] = semver;
  ProjectPackageJSON.devDependencies['rax-webpack-plugin'] = semver;
  fs.writeFileSync(PROJECT_DEPENDENCIES_FILE, JSON.stringify(ProjectPackageJSON, null, '  '));
  console.log('*', PROJECT_DEPENDENCIES_FILE);

  console.log('Update rax-web-framework version in index.html');
  const GENERATOR_HTML_FILE = path.resolve(__dirname, '../packages/rax-cli/src/generator/templates/public/index.html');

  const examplesHtmlEntry = getExamplesHtmlEntry();
  const htmlEntry = examplesHtmlEntry.concat(GENERATOR_HTML_FILE);
  htmlEntry.forEach(function(f) {
    console.log('*', f);
    const HTMLString = String(fs.readFileSync(f));
    const updatedHTMLString = HTMLString.replace(/web-rax-framework@\d*.\d*.\d*/g, 'web-rax-framework@' + version);
    fs.writeFileSync(f, updatedHTMLString);
  });

  execSync(
    'npm run bootstrap && npm run build && npm run lint && npm run test &&' +
    'lerna publish --skip-git --repo-version=' + version + ' ' + forcePublish,
    {
      stdio: 'inherit'
    }
  );
} else {
  console.log('Must specific publish version like: npm run publish 0.0.1');
}
