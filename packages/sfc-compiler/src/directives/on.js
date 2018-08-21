const warn = msg => {
  console.error(`[Vue warn]: ${msg}`);
};

module.exports = function on(el, dir) {
  if (process.env.NODE_ENV !== 'production' && dir.modifiers) {
    warn('v-on without argument does not support modifiers.');
  }
  el.wrapListeners = code => `_g(${code},${dir.value})`;
};
