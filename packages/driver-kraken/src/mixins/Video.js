const METHOD = 'method';

export function videoNodeMixin(node) {
  node.play = () => {
    node.emit(METHOD, [node.id, 'play', []]);
  };

  node.pause = () => {
    node.emit(METHOD, [node.id, 'pause', []]);
  };

  node.fastSeek = (duration) => {
    node.emit(METHOD, [node.id, 'fastSeek', [String(duration)]]);
  };

  function setMuted(muted) {
    node.emit(METHOD, [node.id, 'muted', [muted]]);
  }

  // not w3c standard, but maybe useful.
  node.muted = setMuted;

  // compatible with W3C standard
  Object.defineProperty(node, 'muted', {
    configurable: false,
    enumerable: false,
    set(v) {
      setMuted(v);
    },
    get() {
      console.warn('video element\'s muted property is only settable and not readable');
      return null;
    }
  });
}