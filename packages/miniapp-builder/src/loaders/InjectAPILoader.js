module.exports = function(source) {
  return `${source} window.INJECTED_API = _default;`;
};
