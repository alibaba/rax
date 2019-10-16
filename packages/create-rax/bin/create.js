#!/usr/bin/env node
const child_process = require('child_process');

const argv = process.argv.slice(2);

// Install rax-cli manually through cnpm registry
// This way is faster than npm dependence
child_process.spawnSync(
  'npm',
  ['install', 'rax-cli@latest', '-g', '--registry', 'https://registry.npm.taobao.org'],
  { stdio: 'inherit' }
);

child_process.spawnSync('rax', ['init', ...argv], { stdio: 'inherit' });
