'use strict';

const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const PACKAGES_DIR = path.resolve(__dirname, '../packages');

function getPackages() {
  return fs.readdirSync(PACKAGES_DIR)
    .map(file => path.resolve(PACKAGES_DIR, file))
    .filter(f => fs.lstatSync(path.resolve(f)).isDirectory());
}

getPackages().forEach((p) => {
  console.log('npm link', p);
  // Skip link starter kit
  if (p.indexOf('rax-starter-kit') > 0) return;
  spawnSync('npm', ['link', p]);
});
