
/**
const results = {
  "CPU": {
    "01_run1k": {
      "rax": {
        "min": 23,
      },
      "preact": {
        "min": 22,
      }
    },
    "02_replace1k": {}
  }
}
*/
module.exports = function(data) {
  const results = {};

  Object.keys(data).map(framework => {
    const benchmarks = data[framework];

    benchmarks.map((item) => {
      const {
        type,
        benchmark
      } = item;

      if (!results[type]) {
        results[type] = {};
      }

      if (!results[type][benchmark]) {
        results[type][benchmark] = {};
      }

      results[type][benchmark][framework] = item;
    });
  });

  Object.keys(results).map(type => {
    Object.keys(results[type]).map(benchmark => {
      const benchmarkResults = results[type][benchmark];
      const frameworks = Object.keys(benchmarkResults);

      let min = frameworks.reduce((min, result) => {
        return result === null ? min : Math.min(min, benchmarkResults[result].mean);
      }, Number.POSITIVE_INFINITY);

      frameworks.map((f) => {
        const result = benchmarkResults[f];
        result.factor = (result.mean / min).toFixed(2);
        result.deviation = (result.standardDeviation || 0) / result.mean * 100.0;
      });
    });
  });

  return results;
};


