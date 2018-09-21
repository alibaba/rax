module.exports = function(source) {
  const manifestJson = typeof source === 'string' ? JSON.parse(source) : source;
  const pages = manifestJson.pages;
  // Resolve to miniapp-web-renderer local absolute path
  let webRendererPathname = require.resolve('miniapp-web-renderer');

  if (process.platform == 'win32') {
    webRendererPathname = webRendererPathname.replace(/\\/g, '/');
  }

  return `
import { render } from '${webRendererPathname}';

function _requireReturnDefault(obj) { return obj && obj.__esModule ? obj.default : obj; }

const pagesMap = {
  ${
  Object.keys(pages).map((page) => {
    return `  "${page}" : _requireReturnDefault(require('./${pages[page]}'))`;
  }).join(',\n')
}
};

const manifestData = ${
  JSON.stringify(manifestJson, null, 2)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
};

render(manifestData, pagesMap);
`;
};
