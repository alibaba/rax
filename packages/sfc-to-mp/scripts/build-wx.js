const { spawn, spawnSync } = require('child_process');
const path = require('path');

const cli = path.join(__dirname, '../bin/mp.js');
// spawnSync('rm', ['-rf', './dist'], {
//   cwd: path.join(__dirname, '../example'),
// });
const build = spawn('node', [cli, 'watch', '--output=dist', '--target=wx'], {
  cwd: path.join(__dirname, '../example'),
  stdio: 'inherit',
});

build.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
