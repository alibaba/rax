export function cubicBezier(a, b, c, d) {
  if (a < 0 || a > 1 || c < 0 || c > 1) {
    return eases.linear;
  }
  return function(t) {
    if (t <= 0) {
      let startGradient = 0;
      if (a > 0)
        startGradient = b / a;
      else if (!b && c > 0)
        startGradient = d / c;
      return startGradient * t;
    }
    if (t >= 1) {
      let endGradient = 0;
      if (c < 1)
        endGradient = (d - 1) / (c - 1);
      else if (c == 1 && a < 1)
        endGradient = (b - 1) / (a - 1);
      return 1 + endGradient * (t - 1);
    }

    let start = 0, end = 1;
    let mid;
    function f(a, b, m) {
      return 3 * a * (1 - m) * (1 - m) * m + 3 * b * (1 - m) * m * m + m * m * m;
    }
    while (start < end) {
      mid = (start + end) / 2;
      const xEst = f(a, c, mid);
      if (Math.abs(t - xEst) < 0.00001) {
        return f(b, d, mid);
      }
      if (xEst < t) {
        start = mid;
      } else {
        end = mid;
      }
    }
    return f(b, d, mid);
  };
}

/**
 * parse easing function
 * eg. linear、ease、cubic-bezier(0.25, 0.1, 0.25, 1)
 * @param {string} easingString easing string
 * @return {function} timing function
 */
export function parseEasingFunction(easingString) {
  if (!easingString) {
    return eases.linear;
  }
  const numberString = '\\s*(-?\\d+\\.?\\d*|-?\\.\\d+)\\s*';
  const cubicBezierReg = new RegExp('cubic-bezier\\(' + numberString + ',' + numberString + ',' + numberString + ',' + numberString + '\\)');

  if (eases[easingString]) {
    return eases[easingString];
  }
  const cubicData = cubicBezierReg.exec(easingString);

  if (cubicData) {
    return cubicBezier.apply(null, cubicData.slice(1).map(Number));
  }
  return eases.linear;
}

const eases = {
  linear: (t) => {
    return t;
  },
  ease: cubicBezier(0.25, 0.1, 0.25, 1),
  'ease-in': cubicBezier(0.42, 0, 1, 1),
  'ease-out': cubicBezier(0, 0, 0.58, 1),
  'ease-in-out': cubicBezier(0.42, 0, 0.58, 1)
};

export default eases;