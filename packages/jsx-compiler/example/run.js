const { readFileSync } = require('fs');
const { resolve } = require('path');
const compile = require('../');
const { baseOptions } = require('../src/options');

const template = readFileSync(resolve(__dirname, 'example.jsx'), 'utf-8');
const ret = compile(template, baseOptions);
console.log(ret);
