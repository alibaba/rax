const shouldIgnoreConsoleError = require('./shouldIgnoreConsoleError');
const util = require('util');
const chalk = require('chalk');

expect.extend({
  ...require('./toWarnDev')
});

const env = jasmine.getEnv();

['error', 'warn'].forEach(methodName => {
  const unexpectedConsoleCallStacks = [];
  const newMethod = function(format, ...args) {
    // Ignore uncaught errors reported by jsdom
    // and React addendums because they're too noisy.
    if (methodName === 'error' && shouldIgnoreConsoleError(format, args)) {
      return;
    }

    // Capture the call stack now so we can warn about it later.
    // The call stack has helpful information for the test author.
    // Don't throw yet though b'c it might be accidentally caught and suppressed.
    const stack = new Error().stack;
    unexpectedConsoleCallStacks.push([
      stack.substr(stack.indexOf('\n') + 1),
      util.format(format, ...args),
    ]);
  };

  console[methodName] = newMethod;

  env.beforeEach(() => {
    unexpectedConsoleCallStacks.length = 0;
  });

  env.afterEach(() => {
    if (console[methodName] !== newMethod) {
      throw new Error(
        `Test did not tear down console.${methodName} mock properly.`
      );
    }

    if (unexpectedConsoleCallStacks.length > 0) {
      const messages = unexpectedConsoleCallStacks.map(
        ([stack, message]) =>
          `${chalk.red(message)}\n` +
          `${stack
            .split('\n')
            .map(line => chalk.gray(line))
            .join('\n')}`
      );

      const message =
        `Expected test not to call ${chalk.bold(
          `console.${methodName}()`
        )}.\n\n` +
        'If the warning is expected, test for it explicitly by:\n' +
        `1. Using the ${chalk.bold('.toWarnDev()')} / ${chalk.bold(
          '.toLowPriorityWarnDev()'
        )} matchers, or...\n`;

      throw new Error(`${message}\n\n${messages.join('\n\n')}`);
    }
  });
});
