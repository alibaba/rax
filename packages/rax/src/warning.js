let warning = () => {};

if (process.env.NODE_ENV !== 'production') {
  warning = (template, ...args) => {
    if (template == null) {
      throw new Error(
        '`warning(condition, template, ...args)` requires a warning message template'
      );
    }

    if (typeof console !== 'undefined') {
      let argsWithFormat = args.map(item => '' + item);
      argsWithFormat.unshift('Warning: ' + template);
      Function.prototype.apply.call(console.error, console, argsWithFormat);
    }

    try {
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      let argIndex = 0;
      const message =
        'Warning: ' + template.replace(/%s/g, () => args[argIndex++]);
      throw new Error(message);
    } catch (x) {}
  };
}

export default warning;
