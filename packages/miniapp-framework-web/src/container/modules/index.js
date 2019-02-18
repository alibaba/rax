import my from './my';

const Modules = {
  my
};

export function $call(moduleName, method, params, resolveCallback, rejectCallback) {
  let module = Modules[moduleName];

  if (!module) {
    console.error('Module not exists or supported.');
    return;
  }

  if (!module[method] || typeof module[method] !== 'function') {
    console.error('Module method not exists or supported.');
    return;
  }

  module[method](params, resolveCallback, rejectCallback);
}
