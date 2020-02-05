const { join } = require('path');
const { existsSync } = require('fs-extra');
const spawn = require('cross-spawn');

const dist = join(__dirname, '..', 'dist');
const cwd = join(__dirname, '..');

if (!existsSync(dist)) {
  spawn.sync('npm', ['run', 'build'], { cwd });
}
