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
  const RAX_VERSION_FILE = 'packages/rax/src/version.js';
  console.log('Update rax version file to', version);
  fs.writeFileSync(RAX_VERSION_FILE, 'export default \'' + version + '\';\n');

  const GENERATOR_DEPENDENCIES_FILE = 'packages/rax-cli/src/generator/templates/package.json';
  console.log('Update dependencies in generator');
  const JSONString = fs.readFileSync(GENERATOR_DEPENDENCIES_FILE);
  const packageJSON = JSON.parse(JSONString);

  const ver = '^' + version;
  packageJSON.dependencies.rax = ver;
  packageJSON.dependencies['rax-components'] = ver;
  packageJSON.devDependencies['babel-preset-rax'] = ver;
  packageJSON.devDependencies['rax-webpack-plugin'] = ver;
  packageJSON.devDependencies['stylesheet-loader'] = ver;

  fs.writeFileSync(GENERATOR_DEPENDENCIES_FILE, JSON.stringify(packageJSON, null, '  '));

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
