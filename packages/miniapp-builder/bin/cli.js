#!/usr/bin/env node

const program = require('commander');
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
};

program
  .arguments('<cmd> [env]')

  .version(pkgJSON.version)
  .option('-d, --dir <dir>', '<String>  Current work directory, default to CWD')
  .option('-p, --port <port>', '<Number> Dev server listening port, default to 6001')
  .option('--renderer-inspect <rendererInspect>', '<Boolean> Enable renderer inspect mode, default to false')
  .option('--renderer-inspect-port <rendererInspectPort>', '<Number> Client debug port, default to 9000')
  .option('--renderer-url <rendererUrl>', '<String> Renderer url for debug')
  .action(function(cmd, env) {
    const projectDir = program.dir ? resolveDir(program.dir) : DEFAULT_WORKDIR;
    const port = program.port || DEFAULT_PORT;
    const rendererInspect = !!program.rendererInspect;
    const rendererInspectPort = program.rendererInspectPort || 9000;
    const rendererUrl = !!program.rendererUrl;

    const miniappType = getMiniappType(projectDir);
    if (!miniappType) {
      console.log('Please Check your current directory is a valid project.');
      process.exit(1);
    } else {
      console.log(`Detect ${TYPE_MAP[miniappType]} type project.`);
    }

    switch (cmd) {
      case 'start': {
        require('../src/server')({
          projectDir,
          port,
          rendererInspect,
          rendererInspectPort,
          rendererUrl,
        });
        break;
      }
      case 'build': {
        require('../src/builder')({
          projectDir,
        });
        break;
      }
      default:
        break;
    }
  });

program.parse(process.argv);

function resolveDir(dir) {
  if (!dir) {
    return cwd;
  } else if (isAbsolute(dir)) {
    return dir;
  } else {
    return resolve(cwd, dir);
  }
}
