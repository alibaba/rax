module.exports = {
  get Promise() {
    return require('./promise');
  },
  get Symbol() {
    return require('./symbol');
  },
  get Map() {
    return require('./map');
  },
  get Set() {
    return require('./set');
  },
  get WeakMap() {
    return require('./weakmap');
  },
  get WeakSet() {
    return require('./weakset');
  },
  get FontFace() {
    return require('./fontface');
  },
  get URL() {
    return require('./url');
  },
  get URLSearchParams() {
    return require('./url-search-params');
  },
  get matchMedia() {
    return require('./matchMedia');
  },
  get polyfills() {
    try {
      require('./array.es6');
      require('./array.es7');
      require('./number.es6');
      require('./object.es6');
      require('./object.es8');
      require('./string.es6');
      require('./string.es7');
    } catch (error) {
      // TODO
    }
  }

};
