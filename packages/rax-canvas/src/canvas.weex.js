import GCanvas from 'weex-gcanvas';

export function disable() {
  GCanvas.disable();
}

export function init(element) {
  return new Promise(function(resolve) {
    const gcanvas = GCanvas.start(element);

    const ctx = gcanvas.getContext('2d');
    resolve(ctx);
  });
};
