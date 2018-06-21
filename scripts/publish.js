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
      let f = path.resolve(EXAMPLES_DIR, file, 'public/index.html');
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
  // update rax-cli depenpencies - begin
  const GENERATOR_DEPENDENCIES_FILE = path.resolve(__dirname, '../packages/rax-cli/src/generator/templates/package.json');
  const JSONString = fs.readFileSync(GENERATOR_DEPENDENCIES_FILE);
  const packageJSON = JSON.parse(JSONString);
  packageJSON.dependencies.rax = semver;
  packageJSON.dependencies['rax-view'] = semver;
  packageJSON.dependencies['rax-text'] = semver;
  packageJSON.devDependencies['rax-scripts'] = semver;

  fs.writeFileSync(GENERATOR_DEPENDENCIES_FILE, JSON.stringify(packageJSON, null, '  '));
  console.log('*', GENERATOR_DEPENDENCIES_FILE);
  // update rax-cli depenpencies - end

  // update rax-scripts dependencies - begin
  const RAX_SCRIPTS_DEPENDENCIES_FILE = path.resolve(__dirname, '../packages/rax-scripts/package.json');
  const raxScriptPackageJSONString = fs.readFileSync(RAX_SCRIPTS_DEPENDENCIES_FILE);
  const raxScritpsPackageJSON = JSON.parse(raxScriptPackageJSONString);
  raxScritpsPackageJSON.dependencies['babel-preset-rax'] = semver;
  raxScritpsPackageJSON.dependencies['image-source-loader'] = semver;
  raxScritpsPackageJSON.dependencies['rax-hot-loader'] = semver;
  raxScritpsPackageJSON.dependencies['rax-hot-module-replacement-webpack-plugin'] = semver;
  raxScritpsPackageJSON.dependencies['rax-webpack-plugin'] = semver;
  raxScritpsPackageJSON.dependencies['stylesheet-loader'] = semver;

  fs.writeFileSync(RAX_SCRIPTS_DEPENDENCIES_FILE, JSON.stringify(raxScritpsPackageJSON, null, '  '));
  console.log('*', RAX_SCRIPTS_DEPENDENCIES_FILE);
  // update rax-scripts dependencies - end

  const PROJECT_DEPENDENCIES_FILE = path.resolve(__dirname, '../package.json');
  const ProjectPackageJSON = JSON.parse(fs.readFileSync(PROJECT_DEPENDENCIES_FILE));
  ProjectPackageJSON.devDependencies['babel-preset-rax'] = semver;
  ProjectPackageJSON.devDependencies['rax-webpack-plugin'] = semver;
  ProjectPackageJSON.devDependencies['stylesheet-loader'] = semver;

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
    'npm run build && npm run lint && npm run test &&' +
    'lerna publish --skip-git --repo-version=' + version + ' ' + forcePublish, {
      stdio: 'inherit'
    }
  );
} else {
  console.log('Must specific publish version like: npm run publish 9.9.9');
}
