import GCanvas from 'weex-plugin--weex-gcanvas';

export function disable() {
  GCanvas.disable();
}

export function init(element) {
  return new Promise(function(resolve) {
    GCanvas.start(element.ref, function() {
      resolve(GCanvas.getContext('2d'));
    });
  });
};
