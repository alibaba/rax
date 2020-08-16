const Table = require('cli-table');
const chalk = require('chalk');
const { loadFrameworkVersionInformation, getOSInformation } = require('./common');


const TABLE_CONFIG = {
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
};

module.exports = function(data, frameworks, benchmarks) {
  const osInformation = getOSInformation();

  console.log();
  console.log('The benchmark was run on:');
  Object.keys(osInformation).map(info => {
    console.log('   ' + info.toUpperCase() + ': ' + osInformation[info]);
  });

  const frameworksInfo = loadFrameworkVersionInformation(frameworks);
  Object.keys(data).map(type => {
    console.log();
    console.log(chalk.green(data[type].info));
    console.log();

    const table = new Table(TABLE_CONFIG);

    // header
    const rowHeader = [chalk.white.bold('Name')];
    frameworks.map(framework => {
      const frameworkInfo = frameworksInfo[framework];
      const title = frameworkInfo.version ? `${frameworkInfo.name}@${frameworkInfo.version}` : frameworkInfo.name;
      rowHeader.push(chalk.white.bold(title));
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

    console.log(table.toString());
  });
};
