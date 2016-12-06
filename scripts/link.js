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
  if (p.indexOf('babel-preset-rax') > 0) return;
  console.log('npm link', p);
  spawnSync('npm', ['link', p]);
});
