module.exports = function(source) {
  const manifestJson = typeof source === 'string' ? JSON.parse(source) : source;
  const pages = manifestJson.pages;
  // Resolve to miniapp-web-renderer local absolute path
  let webRendererAbsolutePath = require.resolve('miniapp-web-renderer');

  if (process.platform == 'win32') {
    webRendererAbsolutePath = webRendererAbsolutePath.replace(/\\/g, '/');
  }

  return `
const miniAppwebRenderer = require('${webRendererAbsolutePath}');

function _r(obj) { return obj && obj.__esModule ? obj.default : obj; }

const pagesMap = {
  ${
  Object.keys(pages).map((page) => {
    return `'${page}' : _r(require('./${pages[page]}'))`;
  }).join(',\n')
}
};

const manifestData = ${
  JSON.stringify(manifestJson, null, 2)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
};

_r(miniAppwebRenderer).render(manifestData, pagesMap);
`;
};
