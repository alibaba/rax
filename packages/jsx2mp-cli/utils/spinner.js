const ora = require('ora');
const consoleClear = require('console-clear');
const spinner = ora({spinner: 'arc' });

const methods = ['start', 'succeed'];

for (let method of methods) {
  const tempMethod = spinner[method];
  spinner[method] = function (...arg) {
    consoleClear();
    tempMethod.apply(this, arg);
  }
}

module.exports = spinner;
