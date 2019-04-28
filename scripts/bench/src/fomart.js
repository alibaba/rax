const { BenchmarkTypeInfo } = require('./benchmarks');

/**
const results = {
  "CPU": {
    "benchmarks": {
      "01_run1k": {
        "rax": {
          "min": 23,
        },
        "preact": {
          "min": 22,
        }
      },
      "02_replace1k": {}
    },
    "mean": "1.20"
  }
}
*/
module.exports = function(data, frameworks) {
  const results = {};

  Object.keys(data).map(framework => {
    const benchmarks = data[framework];

    benchmarks.map((item) => {
      const {
        type,
        benchmark
      } = item;

      if (!results[type]) {
        results[type] = {
          benchmarks: {},
          mean: {},
          info: BenchmarkTypeInfo[type.toUpperCase()]
        };
      }

      const benchmarksResults = results[type].benchmarks;

      if (!benchmarksResults[benchmark]) {
        benchmarksResults[benchmark] = {};
      }

      benchmarksResults[benchmark][framework] = item;
    });
  });

  Object.keys(results).map(type => {
    const resultsForType = results[type];

    // compute factor for each benchmark
    Object.keys(resultsForType.benchmarks).map(benchmark => {
      const benchmarkResults = resultsForType.benchmarks[benchmark];

      let min = frameworks.reduce((min, framework) => {
        return benchmarkResults[framework] ? Math.min(min, benchmarkResults[framework].mean) : min;
      }, Number.POSITIVE_INFINITY);

      frameworks.map((framework) => {
        const result = benchmarkResults[framework];
        if (result) {
          result.factor = (result.mean / min).toFixed(2);
          result.deviation = (result.standardDeviation || 0) / result.mean * 100.0;
        }
      });
    });

    // compute geometric mean for each framwork
    frameworks.map(framework => {
      const resultsForFramework = Object.keys(resultsForType.benchmarks).map(benchmark => {
        const benchmarkResults = resultsForType.benchmarks[benchmark];
        return benchmarkResults[framework];
      });
      const mean = computeGeometricMean(resultsForFramework);
      results[type].mean[framework] = mean;
    });
  });

  return results;
};

// https://en.wikipedia.org/wiki/Geometric_mean
function computeGeometricMean(resultsForFramework) {
  let count = 0.0;
  let gMean = resultsForFramework.reduce((gMean, r) => {
    if (r) {
      count++;
      gMean *= r.factor;
    }
    return gMean;
  }, 1.0);
  let value = Math.pow(gMean, 1 / count).toFixed(2);
  return value;
}