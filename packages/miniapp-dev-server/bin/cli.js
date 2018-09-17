#!/usr/bin/env node

const program = require("commander");
const pkgJSON = require("../package.json");
const { resolve, isAbsolute } = require("path");
const getMiniappType = require("../src/config/getMiniappType");

// print dependencies versions
console.log(`miniapp-cli: ${pkgJSON.version}`);
console.log(`mp-loader: ${require("mp-loader/package.json").version}`);
console.log(`sfc-loader: ${require("sfc-loader/package.json").version}`);

console.log("---");

const cwd = process.cwd();
const DEFAULT_PORT = 8081;
const DEFAULT_WORKDIR = cwd;
const TYPE_MAP = {
  sfc: "Light Framework",
  mp: "Mini Program Stynax"
};

program
  .arguments("<cmd> [env]")

  .version(pkgJSON.version)
  .option("-d, --dir <dir>", "<String>  Current work directory, default to CWD")
  .option(
    "-p, --port <port>",
    "<Number> Dev server listening port, default to 6001"
  )
  .option("-b, --debug", "<Boolean> Enable debug mode, default to false")
  .action(function(cmd, env) {
    const workDir = program.dir ? resolveDir(program.dir) : DEFAULT_WORKDIR;
    const port = program.port || DEFAULT_PORT;
    const isDebug = !!program.debug;
    const miniappType = getMiniappType(workDir);
    if (!miniappType) {
      console.log("Please Check your current directory is a valid project.");
      process.exit(1);
    } else {
      console.log(`Detect ${TYPE_MAP[miniappType]} type project.`);
    }

    switch (cmd) {
      case "start": {
        require("../src/server")(workDir, port, isDebug);
        break;
      }
      case "build": {
        require("../src/builder")(workDir, isDebug);
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
