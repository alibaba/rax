import domRendererSourceCode from 'raw-loader!driver-worker/dist/driver.worker.renderer';

const domRendererFactory = new Function(
  'window',
  'document',
  'location',
  'module',
  'exports',
  domRendererSourceCode
);

export function getDOMRender(window) {
  const { document, location } = window;
  const module = { exports: null };
  domRendererFactory(window, document, location, module, module.exports);
  return module.exports && module.exports.__esModule ? module.exports.default : module.exports;
}
