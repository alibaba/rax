module.exports = function(source) {
  const jsPath = this.resourcePath;

  return `import api from '${formatPath(jsPath)}'; window.EXTERNAL_API = api;`;
};

function formatPath(p) {
  const isWin = process.platform === 'win32';
  return isWin ? p.replace(/\\/g, '\\\\') : p;
}