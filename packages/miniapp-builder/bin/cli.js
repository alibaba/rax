#!/usr/bin/env node

const program = require('commander');
const address = require('address');
const pkgJSON = require('../package.json');
const { resolve, isAbsolute } = require('path');
const getMiniappType = require('../src/config/getMiniappType');

// print dependencies versions
console.log(`miniapp-cli: ${pkgJSON.version}`);
console.log(`mp-loader: ${require('mp-loader/package.json').version}`);
console.log(`sfc-loader: ${require('sfc-loader/package.json').version}`);

console.log('---');

const cwd = process.cwd();
const DEFAULT_PORT = 8081;
const DEFAULT_WORKDIR = cwd;
const TYPE_MAP = {
  sfc: 'SFC Framework',
  mp: 'Mini Program',
  'mp-plugin': 'Mini Program Plugin',
};

program
  .arguments('<cmd> [env]')

  .version(pkgJSON.version)
  .option('-d, --dir <dir>', '<String>  Current work directory, default to CWD')
  .option('-p, --port <port>', '<Number> Dev server listening port, default to 6001')
  .option('--renderer-inspect <rendererInspect>', '<Boolean> Enable renderer inspect mode, default to false')
  .option('--renderer-inspect-host <rendererInspectHost>', '<String> Inspect host for renderer, default to local ip')
  .option('--renderer-inspect-port <rendererInspectPort>', '<Number> Inspect port for renderer, default to 8080')
  .option('--renderer-url <rendererUrl>', '<String> Renderer url for debug')
  .action(function(cmd, env) {
    const projectDir = program.dir ? resolveDir(program.dir) : DEFAULT_WORKDIR;
    const port = program.port || DEFAULT_PORT;
    const rendererInspect = !!program.rendererInspect;
    const rendererInspectHost = program.rendererInspectHost || address.ip();
    const rendererInspectPort = program.rendererInspectPort || 8080;
    const rendererUrl = program.rendererUrl;

    const miniappType = getMiniappType(projectDir);
    if (!miniappType) {
      console.log('Please Check your current directory is a valid project.');
      process.exit(1);
    } else {
      console.log(`Detect ${TYPE_MAP[miniappType]} type project.`);
    }

    const options = {
      projectDir,
      port,
      rendererInspect,
      rendererInspectHost,
      rendererInspectPort,
      rendererUrl,
      miniappType,
    };
    const defaultFrameworkVersion = require('../src/config/frameworkVersion');
    const getFrameworkVersion = require('../src/config/getFrameworkVersion');
    const { updateFrameworkVersion } = require('../src/config/getFrameworkCDNUrl');
    getFrameworkVersion()
      .then((version) => {
        updateFrameworkVersion(version);
        console.log('Using latest framework version:', version);
        executeCommand(cmd, options);
      })
      .catch((err) => {
        console.warn('Update FrameworkVersion Failed, fallback to default verison:', defaultFrameworkVersion);
        executeCommand(cmd, options);
      });
  });

program.parse(process.argv);

function executeCommand(cmd, options) {
  switch (cmd) {
    case 'start': {
      require('../src/server')(options);
      break;
    }
    case 'build': {
      require('../src/builder')(options);
      break;
    }
    default:
      console.warn('Unknown Command: ' + cmd);
      break;
  }
}

function resolveDir(dir) {
  if (!dir) {
    return cwd;
  } else if (isAbsolute(dir)) {
    return dir;
  } else {
    return resolve(cwd, dir);
  }
}
