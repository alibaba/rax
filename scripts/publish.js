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

const RAX_VERSION_FILE = 'packages/rax/src/version.js';

if (version) {
  console.log('Update rax version file to', version);
  fs.writeFileSync(RAX_VERSION_FILE, 'export default \'' + version + '\';\n');

  execSync(
    'npm run bootstrap && npm run build && npm run lint && npm run test &&' +
    'lerna publish --force-publish=* --skip-git --repo-version=' + version,
    {
      stdio: 'inherit'
    }
  );
}
