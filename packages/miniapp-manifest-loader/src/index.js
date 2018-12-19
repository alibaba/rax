module.exports = function(source) {
  const manifestJson = typeof source === 'string' ? JSON.parse(source) : source;
  const pages = manifestJson.pages;
  // Resolve to miniapp-web-renderer local absolute path
  let webRendererAbsolutePath = require.resolve('miniapp-web-renderer');

  if (process.platform == 'win32') {
    webRendererAbsolutePath = webRendererAbsolutePath.replace(/\\/g, '/');
  }

  return `
function _r(obj) { return obj && obj.__esModule ? obj.default : obj; }

const WebRenderer = _r(require('${webRendererAbsolutePath}'));

const pages = {
  ${
  Object.keys(pages).map((page) => {
    return `'${page}' : _r(require('./${pages[page]}'))`;
  }).join(',\n')
}
};

const manifest = ${
  JSON.stringify(manifestJson, null, 2)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
};

WebRenderer.render(manifest, pages);
`;
};
