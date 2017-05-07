'use strict';
/**
 * build rax-themes
 */
const path = require('path');
const execSync = require('child_process').execSync;

const themes = ['zhihu', 'taobao', 'chat'];

themes.forEach(function(theme) {
  const themePath = path.resolve(__dirname, `../packages/rax-theme-${theme}`);

  execSync('npm run build', {
    cwd: themePath,
    stdio: 'inherit'
  });
});