const { createElement } = require('rax');
const renderer = require('./lib');

renderer.create(createElement('div', {}, [123]));
