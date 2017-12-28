let _Math = {
  DEG2RAD: Math.PI / 180,
  RAD2DEG: 180 / Math.PI,
  degToRad: function(degrees) {
    return degrees * _Math.DEG2RAD;
  },
  radToDeg: function(radians) {
    return radians * _Math.RAD2DEG;
  }
};

export default _Math;