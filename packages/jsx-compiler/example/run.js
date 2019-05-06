const { readFileSync } = require('fs');
const { resolve } = require('path');
const compile = require('../');
const { baseOptions } = require('../src/options');

const path = resolve(__dirname, 'example.jsx');
const template = readFileSync(path, 'utf-8');
const ret = compile(template, Object.assign({}, baseOptions, {
  cwd: __dirname,
}));
console.log(ret);
