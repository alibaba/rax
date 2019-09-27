const ora = require('ora');
const consoleClear = require('console-clear');

const methods = ['start', 'succeed'];
const spinner = ora({ spinner: 'arc' });

// Default to clear screen each time.
spinner.shouldClear = true;

for (let method of methods) {
  const tempMethod = spinner[method];
  spinner[method] = function(...arg) {
    if (spinner.shouldClear) consoleClear(true);
    tempMethod.apply(this, arg);
  };
}

module.exports = spinner;
