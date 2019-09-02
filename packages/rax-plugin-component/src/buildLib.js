'use strict';

const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

const gulp = require('gulp');
const runSequence = require('run-sequence').use(gulp);

const { registerTasks } = require('./gulpConfig');

const mpBuild = require('./config/miniapp/build');

module.exports = async(api, options = {}) => {
  const { context, log } = api;
  const { rootDir, userConfig } = context;
  const { outputDir } = userConfig;
  const { targets = [] } = options;
  const BUILD_DIR = path.resolve(rootDir, outputDir);
  const enableTypescript = fs.existsSync(path.join(rootDir, 'tsconfig.json'));

  log.info('component', chalk.green('Build start... '));
  registerTasks({ api, gulp });

  return new Promise((resolve, reject) => {
    const buildMiniapp = ~targets.indexOf('miniapp');

    fs.removeSync(path.join(BUILD_DIR, 'miniappTemp'));

    // build web & weex
    runSequence(...getTasks(enableTypescript), async() => {
      if (!buildMiniapp) {
        return resolve();
      }

      // build miniapp
      log.info('component', 'Starting build miniapp lib');
      if (enableTypescript) {
        runSequence(...getTasks(enableTypescript, buildMiniapp), async() => {
          const mpErr = await mpBuild(context, 'lib/miniappTemp/index');

          log.info('component', 'Remove temp directory');
          fs.removeSync(path.join(BUILD_DIR, 'miniappTemp'));

          if (mpErr) {
            resolve(mpErr);
          }
        });
      } else {
        const mpErr = await mpBuild(context);

        if (mpErr) {
          resolve(mpErr);
        }
      }
    });
  });
};

function getTasks(enableTS, buildMiniapp) {
  if (enableTS) {
    if (buildMiniapp) {
      return [
        'miniappClean',
        [
          'miniappTs',
          'miniappCopyOther',
        ],
      ];
    }

    return [
      'clean',
      [
        'js',
        'ts',
        'copyOther',
      ],
    ];
  }

  return [
    'clean',
    [
      'js',
      'copyOther',
    ],
  ];
}
