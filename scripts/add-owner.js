// Usage: node scripts/add-owner.js user
'use strict';

const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

const PACKAGES_DIR = path.resolve(__dirname, '../packages');

const user = process.argv[2];

fs.readdirSync(PACKAGES_DIR)
.forEach(function(packageName) {
  var packageJSON = require(path.join(PACKAGES_DIR, packageName, 'package.json'));
  if (packageJSON.private) {
    return console.log('Skip private package:', packageName);
  }

  execSync(
    'npm owner add ' + user + ' ' + packageName,
    {
      stdio: 'inherit'
    }
  );
});
