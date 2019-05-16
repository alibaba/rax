const {
  readFileSync,
  existsSync,
  lstatSync,
  copySync,
  mkdirpSync,
  removeSync,
} = require('fs-extra');
const { spawnSync } = require('child_process');
const { resolve } = require('path');
const colors = require('colors');
const chokidar = require('chokidar');
const inquirer = require('inquirer');
const App = require('./transformer/App');
const Watch = require('./transformer/Watcher');

/**
 * Transform a jsx project.
 * @param sourcePath {String} Absolute path to source path.
 * @param distPath {String} Absolute distPath to source path.
 * @param enableWatch {Boolean} Watch file changes.
 */
async function transformJSXToMiniProgram(sourcePath, distPath, enableWatch = false) {
  if (!isDirectory(sourcePath)) throw new Error('Not a valid path.');

  if (existsSync(distPath)) {
    const needClean = await ask('发现目标目录 dist 已存在，是否需要清理?');
    if (needClean) {
      removeSync(distPath);
      printLog(colors.green('清理完成'), 'dist/');
    }
  }

  // Make sure dist directory created.
  mkdirpSync(distPath);
  printLog(colors.green('创建目录'), 'dist/');

  const app = new App(sourcePath, {
    appDirectory: sourcePath,
    distDirectory: distPath,
  });

  if (enableWatch) {
    printLog(colors.green('将监听以下路径的文件变更'), sourcePath);
    new Watch({sourcePath, distPath});
  }

  // const shouldInstallDistNPM = await ask('是否需要自动安装 npm 到构建目录中?', false);
  // if (shouldInstallDistNPM) {
  //   invokeNpmInstall(distPath);
  // }
}

function invokeNpmInstall(path) {
  printLog(colors.green('运行'), 'npm install --production');
  return spawnSync('npm', ['install', '--production'], {
    cwd: path,
    env: process.env,
    stdio: 'inherit'
  });
}

/**
 * Start watching files
 * @param sourcePath {String} Absolute source path.
 * @param distPath {String} Absolute dist path.
 * @param onFileChange {Function} Callback to handle files.
 * @return watcher {chokidar.Watcher}
 */
function startWatching(sourcePath, distPath, onFileChange) {
  const watcherPaths = [sourcePath];
  const watcher = chokidar.watch(watcherPaths, {
    ignored: [/(^|[/\\])\../, distPath],
    persistent: true,
    ignoreInitial: false,
  });

  return watcher
    .on('add', onFileChange)
    .on('change', onFileChange);
}

/**
 * Get file content as utf-8 text.
 * @param path {String} Absolute path to a text file.
 */
function getFileContent(path) {
  return readFileSync(path, 'utf-8');
}

/**
 * Judge a path is a directory.
 * @param path {String} Absolute path to a file or directory.
 * @return {Boolean}
 */
function isDirectory(path) {
  return lstatSync(path).isDirectory();
}

/**
 * Standard method to print logs.
 * @param logs
 */
function printLog(...logs) {
  console.log.apply(console, logs);
}

/**
 * Create an ask prase.
 * @param message {String}
 * @return {Promise} Answer true or false.
 */
function ask(message, defaultVal = true) {
  const name = '_NAME_';
  return inquirer.prompt([
    { type: 'confirm', name, message, default: defaultVal }
  ]).then(answers => answers[name]);
}

module.exports = transformJSXToMiniProgram;
