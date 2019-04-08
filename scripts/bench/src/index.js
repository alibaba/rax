'use strict';
const { join } = require('path');
const { readdirSync, statSync, writeFileSync, existsSync, mkdirSync, readFileSync } = require('fs');
const yargs = require('yargs');
const debug = require('debug');
const chalk = require('chalk');

const { benchmarks } = require('./benchmarks');
const { executeBenchmark } = require('./runner');
const config = require('./config');
const format = require('./fomart');
const print = require('./print');
const createHTTPServer = require('./server');
const { buildBundles } = require('./build');

function getFrameworkNames() {
  return readdirSync(join(__dirname, '../frameworks')).filter(file =>
    statSync(join(__dirname, '../frameworks', file)).isDirectory()
  );
}

async function runBench(framework, benchmarks, local, skipBuild) {
  const errors = [];
  const warnings = [];
  const data = [];

  const resultFolder = './results';
  const resultJSON = `${resultFolder}/${framework}.json`;

  if (local && existsSync(resultJSON)) {
    const data = JSON.parse(readFileSync(resultJSON, {
      encoding: 'utf-8'
    }));

    return {
      data,
      errors,
      warnings
    };
  }

  if (!skipBuild) {
    await buildBundles(framework);
  }

  for (let i = 0; i < benchmarks.length; i ++) {
    const benchmark = benchmarks[i];

    try {
      const benchmarkOptions = {
        port: config.PORT.toFixed(),
        headless: args.headless,
        chromeBinaryPath: args.chromeBinary,
        numIterationsForAllBenchmarks: config.REPEAT_RUN,
        numIterationsForStartupBenchmark: config.REPEAT_RUN_STARTUP
      };

      const results = await executeBenchmark(
        framework,
        benchmark,
        benchmarkOptions
      );

      errors.splice(errors.length, 0, ...results.errors);
      warnings.splice(warnings.length, 0, ...results.warnings);
      data.splice(data.length, 0, ...results.results);
    } catch (err) {
      console.log(err);
      console.log(
        `Error executing benchmark ${framework} and benchmark ${
          benchmark.id
        }`
      );
    }
  }

  if (!existsSync(resultFolder)) {
    mkdirSync(resultFolder);
  }

  writeFileSync(
    resultJSON,
    JSON.stringify(data, null, 2),
    { encoding: 'utf8' }
  );

  return {
    errors,
    warnings,
    data
  };
}

async function run(frameworkNames, benchmarkNames, local, skipBuild) {
  const server = createHTTPServer();

  const errors = [];
  const warnings = [];
  const data = {};

  const frameworks = getFrameworkNames();

  const runFrameworks = frameworks.filter(f =>
    frameworkNames.some(name => f.indexOf(name) > -1)
  );
  const runBenchmarks = benchmarks.filter(b =>
    benchmarkNames.some(name => b.id.toLowerCase().indexOf(name) > -1)
  );

  console.log('Frameworks that will be benchmarked', runFrameworks);
  console.log('Benchmarks that will be run', runBenchmarks.map(b => b.id));
  console.log();

  for (let i = 0; i < runFrameworks.length; i++) {
    const framework = runFrameworks[i];
    const results = await runBench(framework, runBenchmarks, local, skipBuild);

    errors.splice(errors.length, 0, ...results.errors);
    warnings.splice(warnings.length, 0, ...results.warnings);
    data[framework] = results.data;
  }

  server.close();

  const allBenchmarks = {};
  runBenchmarks.forEach((benchmark) => {
    let r = benchmark.resultKinds ? benchmark.resultKinds() : [benchmark];
    r.forEach(benchmarkInfo => {
      allBenchmarks[benchmarkInfo.id] = benchmarkInfo;
    });
  });


  debug('results')(data);

  const formatedData = format(data, runFrameworks, allBenchmarks);

  debug('formatedData')(formatedData);

  print(formatedData, runFrameworks, allBenchmarks);

  if (warnings.length > 0) {
    console.log('================================');
    console.log('The following warnings were logged:');
    console.log('================================');
    warnings.forEach(e => {
      console.log(e);
    });
  }
  if (errors.length > 0) {
    console.log('================================');
    console.log('The following benchmarks failed:');
    console.log('================================');
    errors.forEach(e => {
      console.log('[' + e.imageFile + ']');
      console.log(e.exception);
      console.log();
    });
    throw 'Benchmarking failed with errors';
  }
}

const args = yargs(process.argv)
  .usage(
    '$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...] [--count n] [--exitOnError]'
  )
  .help('help')
  .default('check', 'false')
  .default('fork', 'true')
  .default('exitOnError', 'false')
  .default('count', config.REPEAT_RUN)
  .default('port', config.PORT)
  .string('chromeBinary')
  .string('chromeDriver')
  .boolean('headless')
  .boolean('skipBuild')
  .boolean('local')
  .array('framework')
  .array('benchmark').argv;

config.PORT = Number(args.port);
config.REPEAT_RUN = Number(args.count);
config.EXIT_ON_ERROR = args.exitOnError === 'true';

const runBenchmarks =
  args.benchmark && args.benchmark.length > 0 ? args.benchmark : [''];
const runFrameworks =
  args.framework && args.framework.length > 0 ? args.framework : [''];

debug('args')(args);

if (args.help) {
  yargs.showHelp();
} else {
  run(runFrameworks, runBenchmarks, args.local, args.skipBuild)
    .then(_ => {
      console.log();
      console.log(chalk.green('successful run'));
      console.log();
    })
    .catch(error => {
      console.log(error);
      console.log('run was not completely sucessful');
    });
}
