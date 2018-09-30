const { spawn } = require('child_process');
const path = require('path');

const cli = path.join(__dirname, '../bin/mp.js');

const build = spawn('node', [cli, 'watch', '--output=dist'], {
  cwd: path.join(__dirname, '../example'),
  env: {
    ...process.env,
    DEBUG: 'mp*',
  },
  stdio: 'inherit',
});

build.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
