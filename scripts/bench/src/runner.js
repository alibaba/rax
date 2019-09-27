'use strict';

const chrome = require('selenium-webdriver/chrome');
const selenium_webdriver = require('selenium-webdriver');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');
const R = require('ramda');
const jStat = require('jstat').jStat;

const { BenchmarkType } = require('./benchmarks');
const webdriverAccess = require('./webdriverAccess');
const config = require('./config');

require('chromedriver');

selenium_webdriver.promise.USE_PROMISE_MANAGER = false;

function extractRelevantEvents(entries) {
  let filteredEvents = [];
  let protocolEvents = [];
  entries.forEach(x => {
    let e = JSON.parse(x.message).message;
    if (config.LOG_DETAILS) console.log(JSON.stringify(e));
    if (e.method === 'Tracing.dataCollected') {
      protocolEvents.push(e);
    }
    if (
      e.method &&
      (e.method.startsWith('Page') || e.method.startsWith('Network'))
    ) {
      protocolEvents.push(e);
    } else if (e.params.name === 'EventDispatch') {
      if (e.params.args.data.type === 'click') {
        if (config.LOG_TIMELINE)
          console.log('CLICK ', JSON.stringify(e));
        filteredEvents.push({
          type: 'click',
          ts: +e.params.ts,
          dur: +e.params.dur,
          end: +e.params.ts + e.params.dur
        });
      }
    } else if (
      e.params.name === 'TimeStamp' &&
      (e.params.args.data.message === 'afterBenchmark' ||
        e.params.args.data.message === 'finishedBenchmark' ||
        e.params.args.data.message === 'runBenchmark' ||
        e.params.args.data.message === 'initBenchmark')
    ) {
      filteredEvents.push({
        type: e.params.args.data.message,
        ts: +e.params.ts,
        dur: 0,
        end: +e.params.ts
      });
      if (config.LOG_TIMELINE)
        console.log('TIMESTAMP ', JSON.stringify(e));
    } else if (e.params.name === 'navigationStart') {
      filteredEvents.push({
        type: 'navigationStart',
        ts: +e.params.ts,
        dur: 0,
        end: +e.params.ts
      });
      if (config.LOG_TIMELINE)
        console.log('NAVIGATION START ', JSON.stringify(e));
    } else if (e.params.name === 'Paint') {
      if (config.LOG_TIMELINE)
        console.log('PAINT ', JSON.stringify(e));
      filteredEvents.push({
        type: 'paint',
        ts: +e.params.ts,
        dur: +e.params.dur,
        end: +e.params.ts + e.params.dur,
        evt: JSON.stringify(e)
      });
    } else if (e.params.name === 'MajorGC' && e.params.args.usedHeapSizeAfter) {
      filteredEvents.push({
        type: 'gc',
        ts: +e.params.ts,
        end: +e.params.ts,
        mem: Number(e.params.args.usedHeapSizeAfter) / 1024 / 1024
      });
      if (config.LOG_TIMELINE) console.log('GC ', JSON.stringify(e));
    }
  });
  return { filteredEvents, protocolEvents };
}

async function fetchEventsFromPerformanceLog(driver) {
  let timingResults = [];
  let protocolResults = [];
  let entries = [];
  do {
    entries = await driver
      .manage()
      .logs()
      .get(selenium_webdriver.logging.Type.PERFORMANCE);
    const { filteredEvents, protocolEvents } = extractRelevantEvents(entries);
    timingResults = timingResults.concat(filteredEvents);
    protocolResults = protocolResults.concat(protocolEvents);
  } while (entries.length > 0);
  return { timingResults, protocolResults };
}

function type_eq(requiredType) {
  return e => e.type === requiredType;
}

function type_neq(requiredType) {
  return e => e.type !== requiredType;
}

function asString(res) {
  return res.reduce((old, cur) => old + '\n' + JSON.stringify(cur), '');
}

function extractRawValue(results, id) {
  let audits = results.audits;
  if (!audits) return null;
  let audit_with_id = audits[id];
  if (typeof audit_with_id === 'undefined') return null;
  if (typeof audit_with_id.rawValue === 'undefined') return null;
  return audit_with_id.rawValue;
}

function rmDir(dirPath) {
  try {
    var files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = path.join(dirPath, files[i]);
      if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
      else rmDir(filePath);
    }
  fs.rmdirSync(dirPath);
}

async function runLighthouse(framework, benchmarkOptions) {
  const opts = {
    chromeFlags: [
      '--headless',
      '--no-sandbox',
      '--no-first-run',
      '--enable-automation',
      '--disable-infobars',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-cache',
      '--disable-translate',
      '--disable-sync',
      '--disable-extensions',
      '--disable-default-apps',
      '--window-size=1200,800'
    ],
    onlyCategories: ['performance'],
    port: ''
  };

  try {
    if (fs.existsSync('prefs')) rmDir('prefs');
    fs.mkdirSync('prefs');
    fs.mkdirSync('prefs/Default');
    fs.copyFileSync('chromePreferences.json', 'prefs/Default/Preferences');

    let options = {
      chromeFlags: opts.chromeFlags,
      logLevel: 'info',
      userDataDir: 'prefs'
    };
    if (benchmarkOptions.chromeBinaryPath)
      options.chromePath = benchmarkOptions.chromeBinaryPath;
    let chrome = await chromeLauncher.launch(options);
    opts.port = chrome.port;

    let results = await lighthouse(
      `http://localhost:${benchmarkOptions.port}/frameworks/${framework}/`,
      opts,
      null
    );
    await chrome.kill();
    let LighthouseData = {
      TimeToConsistentlyInteractive: extractRawValue(
        results.lhr,
        'interactive'
      ),
      ScriptBootUpTtime: Math.max(
        16,
        extractRawValue(results.lhr, 'bootup-time')
      ),
      MainThreadWorkCost: extractRawValue(
        results.lhr,
        'mainthread-work-breakdown'
      ),
      TotalKiloByteWeight:
        extractRawValue(results.lhr, 'total-byte-weight') / 1024.0
    };
    return LighthouseData;
  } catch (error) {
    console.log('error running lighthouse', error);
    throw error;
  }
}

async function computeResultsCPU(
  driver,
  benchmarkOptions,
  framework,
  benchmark,
  warnings
) {
  let entriesBrowser = await driver
    .manage()
    .logs()
    .get(selenium_webdriver.logging.Type.BROWSER);
  if (config.LOG_DEBUG) console.log('browser entries', entriesBrowser);
  const perfLogEvents = await fetchEventsFromPerformanceLog(driver);
  let filteredEvents = perfLogEvents.timingResults;
  if (config.LOG_DEBUG)
    console.log('filteredEvents ', asString(filteredEvents));
  let remaining = R.dropWhile(type_eq('initBenchmark'))(filteredEvents);
  let results = [];
  while (remaining.length > 0) {
    let evts = R.splitWhen(type_eq('finishedBenchmark'))(remaining);
    if (R.find(type_neq('runBenchmark'))(evts[0]) && evts[1].length > 0) {
      let eventsDuringBenchmark = R.dropWhile(type_neq('runBenchmark'))(
        evts[0]
      );
      if (config.LOG_DEBUG)
        console.log('eventsDuringBenchmark ', eventsDuringBenchmark);
      let clicks = R.filter(type_eq('click'))(eventsDuringBenchmark);
      if (clicks.length !== 1) {
        console.log(
          'exactly one click event is expected',
          eventsDuringBenchmark
        );
        throw 'exactly one click event is expected';
      }
      let eventsAfterClick = R.dropWhile(type_neq('click'))(
        eventsDuringBenchmark
      );
      if (config.LOG_DEBUG)
        console.log('eventsAfterClick', eventsAfterClick);
      let paints = R.filter(type_eq('paint'))(eventsAfterClick);
      if (paints.length == 0) {
        console.log(
          'at least one paint event is expected after the click event',
          eventsAfterClick
        );
        throw 'at least one paint event is expected after the click event';
      }
      console.log('# of paint events ', paints.length);
      if (paints.length > 2) {
        warnings.push(
          `For framework ${framework.name} and benchmark ${
            benchmark.id
          } the number of paint calls is higher than expected. There were ${
            paints.length
          } paints though at most 2 are expected. Please consider re-running and check the results`
        );
        console.log(
          `For framework ${framework.name} and benchmark ${
            benchmark.id
          } the number of paint calls is higher than expected. There were ${
            paints.length
          } paints though at most 2 are expected. Please consider re-running and check the results`
        );
      }
      paints.forEach(p => {
        console.log('duration to paint ', (p.end - clicks[0].ts) / 1000.0);
      });
      let lastPaint = R.reduce(
        (max, elem) => max.end > elem.end ? max : elem,
        { end: 0 },
        paints
      );
      let upperBoundForSoundnessCheck =
        (R.last(eventsDuringBenchmark).end - eventsDuringBenchmark[0].ts) /
        1000.0;
      let duration = (lastPaint.end - clicks[0].ts) / 1000.0;

      if (config.LOG_DEBUG) {
        console.log(
          '*** duration',
          duration,
          'upper bound ',
          upperBoundForSoundnessCheck
        );
      }

      if (duration < 0) {
        console.log(
          'soundness check failed. reported duration is less 0',
          asString(eventsDuringBenchmark)
        );
        throw 'soundness check failed. reported duration is less 0';
      }
      if (duration > upperBoundForSoundnessCheck) {
        console.log(
          'soundness check failed. reported duration is bigger than whole benchmark duration',
          asString(eventsDuringBenchmark)
        );
        throw 'soundness check failed. reported duration is bigger than whole benchmark duration';
      }
      results.push(duration);
    }
    remaining = R.drop(1, evts[1]);
  }
  if (results.length !== benchmarkOptions.numIterationsForAllBenchmarks) {
    console.log(
      `soundness check failed. number or results isn't ${
        benchmarkOptions.numIterationsForAllBenchmarks
      }`,
      results,
      asString(filteredEvents)
    );
    throw `soundness check failed. number or results isn't ${
      benchmarkOptions.numIterationsForAllBenchmarks
    }`;
  }
  return results;
}

async function computeResultsMEM(
  driver,
  benchmarkOptions,
  framework,
  benchmark,
  warnings
) {
  let entriesBrowser = await driver
    .manage()
    .logs()
    .get(selenium_webdriver.logging.Type.BROWSER);
  if (config.LOG_DEBUG) console.log('browser entries', entriesBrowser);
  let filteredEvents = (await fetchEventsFromPerformanceLog(driver))
    .timingResults;
  if (config.LOG_DEBUG) console.log('filteredEvents ', filteredEvents);
  let remaining = R.dropWhile(type_eq('initBenchmark'))(filteredEvents);
  let results = [];
  while (remaining.length > 0) {
    let evts = R.splitWhen(type_eq('finishedBenchmark'))(remaining);
    if (R.find(type_neq('runBenchmark'))(evts[0]) && evts[1].length > 0) {
      let eventsDuringBenchmark = R.dropWhile(type_neq('runBenchmark'))(
        evts[0]
      );
      if (config.LOG_DEBUG)
        console.log('eventsDuringBenchmark ', eventsDuringBenchmark);
      let gcs = R.filter(type_eq('gc'))(eventsDuringBenchmark);
      let mem = R.last(gcs).mem;
      console.log('*** memory', mem);
      results.push(mem);
    }
    remaining = R.drop(1, evts[1]);
  }
  if (results.length !== benchmarkOptions.numIterationsForAllBenchmarks) {
    console.log(
      `soundness check failed. number or results isn't ${
        benchmarkOptions.numIterationsForAllBenchmarks
      }`,
      results,
      asString(filteredEvents)
    );
    throw `soundness check failed. number or results isn't ${
      benchmarkOptions.numIterationsForAllBenchmarks
    }`;
  }
  return results;
}

function buildDriver(benchmarkOptions) {
  let args = [
    '--js-flags=--expose-gc',
    '--enable-precise-memory-info',
    '--no-first-run',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-cache',
    '--disable-translate',
    '--disable-sync',
    '--disable-extensions',
    '--disable-default-apps',
    '--window-size=1200,800'
  ];

  if (benchmarkOptions.headless) {
    args.push('--headless');
    args.push('--disable-gpu'); // https://bugs.chromium.org/p/chromium/issues/detail?id=737678
    args.push('--no-sandbox');
  }

  let caps = new selenium_webdriver.Capabilities({
    browserName: 'chrome',
    platform: 'ANY',
    version: 'stable',
    'goog:chromeOptions': {
      args: args,
      'perfLoggingPrefs': {
        'enableNetwork': true,
        'enablePage': true,
        'traceCategories': 'devtools.timeline,blink.user_timing'
      },
      'excludeSwitches': [ 'enable-automation' ]
    },
    'goog:loggingPrefs': {
      'browser': 'ALL',
      'performance': 'ALL'
    }
  });
  // port probing fails sometimes on windows, the following driver construction avoids probing:
  let service = new chrome.ServiceBuilder().setPort(benchmarkOptions.chromePort).build();
  var driver = chrome.Driver.createSession(caps, service);

  return driver;
}

async function forceGC(framework, driver) {
  if (framework.startsWith('angular-v4')) {
    // workaround for window.gc for angular 4 - closure rewrites windows.gc");
    await driver.executeScript('window.Angular4PreservedGC();');
  } else {
    for (let i = 0; i < 5; i++) {
      await driver.executeScript('window.gc();');
    }
  }
}

async function runBenchmark(driver, benchmark, framework) {
  await benchmark.run(driver, framework);
  if (config.LOG_PROGRESS)
    console.log('after run ', benchmark.id, benchmark.type, framework);
  if (benchmark.type === BenchmarkType.MEM) {
    await forceGC(framework, driver);
  }
}

async function afterBenchmark(driver, benchmark, framework) {
  if (benchmark.after) {
    await benchmark.after(driver, framework);
    if (config.LOG_PROGRESS)
      console.log(
        'after benchmark ',
        benchmark.id,
        benchmark.type,
        framework.name
      );
  }
}

async function initBenchmark(driver, benchmark, framework) {
  await benchmark.init(driver, framework);
  if (config.LOG_PROGRESS)
    console.log(
      'after initialized ',
      benchmark.id,
      benchmark.type,
      framework.name
    );
  if (benchmark.type === BenchmarkType.MEM) {
    await forceGC(framework, driver);
  }
}

function formatResult(res, dir) {
  let benchmark = res.benchmark;
  let framework = res.framework;
  let keyed = res.framework.keyed;
  let type = null;

  const results = [];

  switch (benchmark.type) {
    case BenchmarkType.CPU:
      type = 'cpu';
      break;
    case BenchmarkType.MEM:
      type = 'memory';
      break;
    case BenchmarkType.STARTUP:
      type = 'startup';
      break;
  }
  for (let resultKind of benchmark.resultKinds()) {
    let data = benchmark.extractResult(res.results, resultKind);
    let s = jStat(data);
    console.log(
      `result ${framework} ${resultKind.id} min ${s.min()} max ${s.max()} mean ${s.mean()} median ${s.median()} stddev ${s.stdev(
        true
      )}`
    );
    let result = {
      framework: res.framework,
      keyed: keyed,
      benchmark: resultKind.id,
      type: type,
      min: s.min(),
      max: s.max(),
      mean: s.mean(),
      median: s.median(),
      geometricMean: s.geomean(),
      standardDeviation: s.stdev(true),
      values: data
    };

    results.push(result);
  }

  return results;
}

async function registerError(driver, framework, benchmark, error) {
  let fileName = 'error-' + framework + '-' + benchmark.id + '.png';
  console.error('Benchmark failed', error);
  let image = await driver.takeScreenshot();
  console.error(`Writing screenshot ${fileName}`);
  fs.writeFileSync(fileName, image, { encoding: 'base64' });
  return { imageFile: fileName, exception: error };
}
const wait = (delay = 1000) => new Promise(res => setTimeout(res, delay));

async function runMemOrCPUBenchmark(framework, benchmark, benchmarkOptions) {
  let errors = [];
  let warnings = [];
  let data = [];
  console.log('benchmarking ', framework, benchmark.id);
  let driver = buildDriver(benchmarkOptions);
  try {
    for (let i = 0; i < benchmarkOptions.numIterationsForAllBenchmarks; i++) {
      try {
        webdriverAccess.setUseShadowRoot(framework.useShadowRoot);
        await driver.get(
          `http://localhost:${benchmarkOptions.port}/frameworks/${framework}/`
        );
        // await (driver as any).sendDevToolsCommand('Network.enable');
        // await (driver as any).sendDevToolsCommand('Network.emulateNetworkConditions', {
        //     offline: false,
        //     latency: 200, // ms
        //     downloadThroughput: 780 * 1024 / 8, // 780 kb/s
        //     uploadThroughput: 330 * 1024 / 8, // 330 kb/s
        // });
        await driver.executeScript("console.timeStamp('initBenchmark')");
        await initBenchmark(driver, benchmark, framework);
        if (benchmark.throttleCPU) {
          console.log('CPU slowdown', benchmark.throttleCPU);
          await driver.sendDevToolsCommand('Emulation.setCPUThrottlingRate', {
            rate: benchmark.throttleCPU
          });
        }
        await driver.executeScript("console.timeStamp('runBenchmark')");
        await runBenchmark(driver, benchmark, framework);
        if (benchmark.throttleCPU) {
          console.log('resetting CPU slowdown');
          await driver.sendDevToolsCommand('Emulation.setCPUThrottlingRate', {
            rate: 1
          });
        }
        await driver.executeScript("console.timeStamp('finishedBenchmark')");
        await afterBenchmark(driver, benchmark, framework);
        await driver.executeScript("console.timeStamp('afterBenchmark')");
      } catch (e) {
        errors.push({
          imageFile: `${framework}-${benchmark.id}`,
          exception: e
        });
        throw e;
      }
    }
    let results =
      benchmark.type === BenchmarkType.CPU
        ? await computeResultsCPU(
          driver,
          benchmarkOptions,
          framework,
          benchmark,
          warnings
        )
        : await computeResultsMEM(
          driver,
          benchmarkOptions,
          framework,
          benchmark,
          warnings
        );
    data = await formatResult(
      { framework: framework, results: results, benchmark: benchmark },
      benchmarkOptions.outputDirectory
    );
    console.log('QUIT');
    console.log();
    await driver.close();
    await driver.quit();
  } catch (e) {
    console.log('ERROR:', e);
    await driver.close();
    await driver.quit();
    if (config.EXIT_ON_ERROR) {
      throw 'Benchmarking failed';
    }
  }

  return { errors, warnings, results: data };
}

async function runStartupBenchmark(framework, benchmark, benchmarkOptions) {
  console.log('benchmarking startup', framework, benchmark.id);

  let errors = [];
  let results = [];
  for (let i = 0; i < benchmarkOptions.numIterationsForStartupBenchmark; i++) {
    try {
      results.push(await runLighthouse(framework, benchmarkOptions));
    } catch (error) {
      errors.push({ imageFile: null, exception: error });
      throw error;
    }
  }
  const formatedResults = await formatResult(
    { framework: framework, results: results, benchmark: benchmark },
    benchmarkOptions.outputDirectory
  );
  return { errors, warnings: [], results: formatedResults };
}

async function executeBenchmark(framework, benchmark, benchmarkOptions) {
  let result;
  if (benchmark.type == BenchmarkType.STARTUP) {
    result = await runStartupBenchmark(
      framework,
      benchmark,
      benchmarkOptions
    );
  } else {
    result = await runMemOrCPUBenchmark(
      framework,
      benchmark,
      benchmarkOptions
    );
  }

  return result;
}

exports.executeBenchmark = executeBenchmark;
