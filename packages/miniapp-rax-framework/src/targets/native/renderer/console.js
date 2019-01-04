import retrocycle from '../../../core/retrocycle';
import Promise from 'runtime-shared/lib/promise';
const CONSOLE_BUNDLE_URL = 'https://g.alicdn.com/miniapp/miniapp-console/rax-console.js?r=' + Date.now();

let consoleCtx = null;
function loadConsole() {
  if (consoleCtx) {
    return Promise.resolve(consoleCtx);
  }
  const script = document.createElement('script');

  return new Promise((resolve, reject) => {
    script.onload = function() {
      consoleCtx = {
        load: window.RaxConsole.default,
        unload: window.RaxConsole.unload
      };
      resolve(consoleCtx);
    };
    script.charset = 'utf-8';
    script.onerror = reject;
    script.src = CONSOLE_BUNDLE_URL;
    document.head.appendChild(script);
  });
}

let beforeConsoleReadyQueen = [];

const logLevels = ['info', 'log', 'error', 'debug', 'warn'];
export function consoleDataCusumer(data) {
  const { payload = {} } = data || {};
  if (payload.type === 'switch') {
    if (payload.value === true) {
      loadConsole().then((ctx) => {
        ctx.instance = ctx.load();
        beforeConsoleReadyQueen.forEach(consoleDataCusumer);
        beforeConsoleReadyQueen = [];
      });
    } else if (payload.value === false) {
      consoleCtx.unload();
      consoleCtx.instance = null;
    }
    return;
  } else if (!consoleCtx || !consoleCtx.instance) {
    beforeConsoleReadyQueen.push(data);
    return;
  } else if (logLevels.indexOf(payload.type) === -1) {
    return;
  } else {
    consoleCtx && consoleCtx.instance && consoleCtx.instance.addMessage({
      source: 'console-api',
      type: 'log',
      level: payload.type,
      parameters: payload.args.map((arg) => retrocycle(arg)),
    });
  }
};
