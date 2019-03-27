const Table = require('cli-table');
const chalk = require('chalk');

module.exports = function(data, frameworks, benchmarks) {
  const table = new Table();

  Object.keys(data).map(type => {
    const rowHeader = [chalk.white.bold(type)];
    frameworks.map((framework) => {
      rowHeader.push(chalk.white.bold(framework));
    });
    table.push(rowHeader);

    const benchmarksResult = data[type];

    Object.keys(benchmarksResult).map((benchmark) => {
      const result = benchmarksResult[benchmark];

      const benchmarkInfo = benchmarks[benchmark];
      const title = benchmarkInfo.label;
      const row = [chalk.gray(title)];

      row[title] = frameworks.map((framework) => {
        if (!result[framework]) {
          row.push('-');
        } else {
          const mean = result[framework].mean.toFixed(2);
          if (result[framework].warning) {
            row.push(chalk.red(mean));
            return;
          }

          if (result[framework].factor > 1.5) {
            row.push(chalk.yellow(mean));
            return;
          }

          row.push(mean);
        }
      });

      table.push(row);
    });
  });

  console.log(table.toString());
};