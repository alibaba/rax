module.exports = function(source) {
  const jsPath = this.resourcePath;

  return `import api from '${jsPath}'; window.EXTERNAL_API = api;`
};
