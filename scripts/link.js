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
  // Skip link starter kit
  if (p.indexOf('babel-preset-rax') > 0 || p.indexOf('babel-plugin-transform-jsx-stylesheet') > 0) return;
  const linkArgv = ['link', p];
  // Skip install devDependencies
  if (p.endsWith('rax-test-renderer')) linkArgv.push('--production');
  if (p.endsWith('rax-components')) linkArgv.push('--production');
  console.log('npm', linkArgv.join(' '));
  spawnSync('npm', linkArgv);
});
