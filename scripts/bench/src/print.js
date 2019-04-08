const Table = require('cli-table');
const chalk = require('chalk');

module.exports = function(data, frameworks, benchmarks) {
  const table = new Table({
    chars: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: ' ',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: '│'
    }
  });

  Object.keys(data).map(type => {
    // header
    const rowHeader = [chalk.white.bold(type)];
    frameworks.map(framework => {
      rowHeader.push(chalk.white.bold(framework));
    });
    table.push(rowHeader);

    const benchmarksResult = data[type].benchmarks;

    // benchmark results
    Object.keys(benchmarksResult).map(benchmark => {
      const result = benchmarksResult[benchmark];

      const benchmarkInfo = benchmarks[benchmark];
      const title = benchmarkInfo.title || benchmarkInfo.label;
      const row = [chalk.gray(title)];

      frameworks.map(framework => {
        if (!result[framework]) {
          row.push('-');
        } else {
          const mean = result[framework].mean.toFixed(2);
          const factor = result[framework].factor;
          if (result[framework].warning) {
            row.push(`${mean} ${chalk.red('(' + factor + ')')}`);
            return;
          }

          if (result[framework].factor > 1.5) {
            row.push(`${mean} ${chalk.yellow('(' + factor + ')')}`);
            return;
          }

          row.push(`${mean} ${chalk.gray('(' + factor + ')')}`);
        }
      });

      table.push(row);
    });

    // geometric mean
    const meanResult = data[type].mean;
    const row = [chalk.gray('slowdown geometric mean')];
    frameworks.map(framework => {
      const result = meanResult[framework];
      if (result > 1.5) {
        row.push(`${chalk.yellow(result)}`);
        return;
      }

      row.push(result);
    });

    table.push(row);
  });

  console.log(table.toString());
};
