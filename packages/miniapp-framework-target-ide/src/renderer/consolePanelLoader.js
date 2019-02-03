const BUNDLE_CONSOLE = 'https://g.alicdn.com/miniapp/miniapp-console/rax-console.js';

let consoleCtx = null;
export function loadConsole() {
  if (consoleCtx) {
    return Promise.resolve(consoleCtx);
  }
  const script = document.createElement('script');

  return new Promise((resolve, reject) => {
    script.onload = function() {
      // eslint-disable-line
      consoleCtx = {
        load: window.RaxConsole.default,
        unload: window.RaxConsole.unload,
      };
      resolve(consoleCtx);
    };
    script.charset = 'utf-8';
    script.onerror = reject;
    script.src = BUNDLE_CONSOLE;
    document.head.appendChild(script);
  });
}
