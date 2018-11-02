export default function createNotImplWarn(text, alias) {
  return function() {
    console.warn(`${text} is not implemented.`);

    if (alias) {
      return alias.apply(this, arguments);
    } else {
      return null;
    }
  };
}
