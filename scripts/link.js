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

const linkSkipPackages = [
  'babel-preset-rax',
  'babel-plugin-transform-jsx-stylesheet',
  'rax-scripts'
];

getPackages().forEach((p) => {
  // Skip link starter kit
  if (linkSkipPackages.some(skipPackage => p.endsWith(skipPackage))) {
    return;
  };
  const linkArgv = ['link', p];
  console.log('npm', linkArgv.join(' '));
  spawnSync('npm', linkArgv);
});
