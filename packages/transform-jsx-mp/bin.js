#!env node
const { resolve } = require('path');
const workDirectory = resolve(process.env.CWD || process.cwd());
const distDirectory = resolve(workDirectory, 'dist');

require('./index')(workDirectory, distDirectory);
