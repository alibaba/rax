let performance = {};

if (typeof window !== 'undefined') {
  performance =
    window.performance ||
    window.msPerformance ||
    window.webkitPerformance || {};
}

function performanceNow() {
  if (performance.now) {
    return performance.now();
  } else {
    return Date.now();
  }
}

export default performanceNow;
