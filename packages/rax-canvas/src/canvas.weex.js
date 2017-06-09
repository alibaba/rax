import GCanvas from 'weex-gcanvas';

export function disable() {
  GCanvas.disable();
}

export function init(element) {
  return new Promise(function(resolve) {
    GCanvas.start(element.ref, function() {
      GCanvas.setDevicePixelRatio();
      const ctx = GCanvas.getContext('2d');
      GCanvas.startLoop();

      GCanvas.render(() => {
        resolve(ctx);
      });
    });
  });
};
