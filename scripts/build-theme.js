/**
 * build rax-themes
 */
'use strict';

const path = require('path');
const execSync = require('child_process').execSync;

const themes = ['zhihu', 'taobao', 'chat', 'buy', 'retail'];

themes.forEach(function(theme) {
  const themePath = path.resolve(__dirname, `../packages/rax-theme-${theme}`);

  execSync('npm run build', {
    cwd: themePath,
    stdio: 'inherit'
  });
});
