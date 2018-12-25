module.exports = function(source) {
  return `${source} window.EXTERNAL_API = _default;`;
};
