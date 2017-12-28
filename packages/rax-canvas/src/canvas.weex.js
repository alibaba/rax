import GCanvas from 'weex-gcanvas';

export function disable() {
  GCanvas.disable();
}

export function init(element) {
  return new Promise(function(resolve) {
    const canvas = GCanvas.start(element);
    canvas.setDevicePixelRatio();
    canvas.startLoop();
    const ctx = canvas.getContext('2d');
    resolve(ctx);
  });
};
