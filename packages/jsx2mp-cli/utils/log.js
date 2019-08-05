const inquirer = require('inquirer');

/**
 * Standard method to print logs.
 * @param logs
 */
const printLog = function(...logs) {
  console.log.apply(console, logs);
};

/**
 * Create an ask prase.
 * @param message {String}
 * @return {Promise} Answer true or false.
 */
const ask = function(message, defaultVal = true) {
  const name = '_NAME_';
  return inquirer.prompt([
    { type: 'confirm', name, message, default: defaultVal }
  ]).then(answers => answers[name]);
};

module.exports = {
  printLog,
  ask
};