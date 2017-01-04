/**
 * Example:
 *  node ./scripts/publish.js 1.0.0
 */
'use strict';

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const spawnSync = require('child_process').spawnSync;
const version = process.argv[2];


if (version) {
  console.log('Update rax version file to', version);
  const RAX_VERSION_FILE = 'packages/rax/src/version.js';
  fs.writeFileSync(RAX_VERSION_FILE, 'export default \'' + version + '\';\n');

  console.log('Update dependencies in package.json generator');
  const GENERATOR_DEPENDENCIES_FILE = 'packages/rax-cli/src/generator/templates/package.json';
  const JSONString = fs.readFileSync(GENERATOR_DEPENDENCIES_FILE);
  const packageJSON = JSON.parse(JSONString);
  const semver = '^' + version;
  packageJSON.dependencies.rax = semver;
  packageJSON.dependencies['rax-components'] = semver;
  packageJSON.devDependencies['babel-preset-rax'] = semver;
  packageJSON.devDependencies['rax-webpack-plugin'] = semver;
  packageJSON.devDependencies['stylesheet-loader'] = semver;

  fs.writeFileSync(GENERATOR_DEPENDENCIES_FILE, JSON.stringify(packageJSON, null, '  '));

  console.log('Update rax-web-framework version in index.html generator');
  const GENERATOR_HTML_FILE = 'packages/rax-cli/src/generator/templates/public/index.html';
  const HTMLString = String(fs.readFileSync(GENERATOR_HTML_FILE));
  const updatedHTMLString = HTMLString.replace(/web-rax-framework@\d*.\d*.\d*/g, 'web-rax-framework@' + version);
  fs.writeFileSync(GENERATOR_HTML_FILE, updatedHTMLString);

  execSync(
    'npm run bootstrap && npm run build && npm run lint && npm run test &&' +
    'lerna publish --force-publish=* --skip-git --repo-version=' + version,
    {
      stdio: 'inherit'
    }
  );
} else {
  console.log('Must specific publish version like: npm run publish 0.0.1');
}
