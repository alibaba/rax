// Usage: node scripts/add-owner.js user
'use strict';

const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

const PACKAGES_DIR = path.resolve(__dirname, '../packages');

const user = process.argv[2];

fs.readdirSync(PACKAGES_DIR)
  .forEach(function(packageName) {
    const pkgJSON = path.join(PACKAGES_DIR, packageName, 'package.json');
    if (!fs.existsSync(pkgJSON)) {
      return;
    }

    var packageJSON = require(pkgJSON);
    if (packageJSON.private) {
      return console.log('Skip private package:', packageName);
    }

    const cmd = 'npm owner add ' + user + ' ' + packageName;
    console.log(cmd);
    execSync(
      cmd,
      {
        stdio: 'inherit'
      }
    );
  });
