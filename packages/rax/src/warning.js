let warning = () => {};

if (process.env.NODE_ENV !== 'production') {
  warning = (template, ...args) => {
    if (typeof console !== 'undefined') {
      let argsWithFormat = args.map(item => '' + item);
      argsWithFormat.unshift('Warning: ' + template);
      // Don't use spread (or .apply) directly because it breaks IE9
      Function.prototype.apply.call(console.error, console, argsWithFormat);
    }

    // For works in DevTools when enable `Pause on caught exceptions`
    // that can find the component where caused this warning
    try {
      let argIndex = 0;
      const message = 'Warning: ' + template.replace(/%s/g, () => args[argIndex++]);
      throw new Error(message);
    } catch (e) {}
  };
}

export default warning;
