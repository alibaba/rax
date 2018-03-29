module.exports = function(responseEnd) {
  let performance = {};
  // TODO: current can not get navigationStart time
  performance.timing = {
    unloadEventStart: 0,
    unloadEventEnd: 0,
    navigationStart: responseEnd,
    redirectStart: 0,
    redirectEnd: 0,
    fetchStart: responseEnd,
    domainLookupStart: responseEnd,
    domainLookupEnd: responseEnd,
    connectStart: responseEnd,
    secureConnectionStart: responseEnd,
    connectStart: responseEnd,
    requestStart: responseEnd,
    responseStart: responseEnd,
    responseEnd,
    domLoading: 0,
    domInteractive: 0,
    domComplete: 0,
    domContentLoadedEventStart: 0,
    domContentLoadedEventEnd: 0,
    loadEventStart: 0,
    loadEventEnd: 0
  };
  performance.now = function() {
    return Date.now() - performance.timing.navigationStart;
  };

  return performance;
};
