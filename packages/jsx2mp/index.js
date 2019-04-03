const {
  readFileSync,
  existsSync,
  lstatSync,
  copySync,
  mkdirpSync,
  readJSONSync,
  removeSync,
} = require('fs-extra');
const { resolve, extname } = require('path');
const colors = require('colors');
const chokidar = require('chokidar');
const glob = require('glob');
const inquirer = require('inquirer');
const TransformerPage = require('./transformer/Page');

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

  const appConfigPath = resolve(sourcePath, 'app.json');
  if (!existsSync(appConfigPath)) {
    throw new Error('app.json should exists.');
  }
  const appConfig = readJSONSync(appConfigPath);

  mkdirpSync(distPath);
  printLog(colors.green('创建目录'), 'dist/');
  if (enableWatch) {
    printLog(colors.green('监听以下路径的文件变更'), sourcePath);
  }

  const globOption = {
    cwd: sourcePath,
    nodir: true,
    dot: true,
    ignore: ['node_modules', 'dist/**', '.DS_Store'],
    absolute: false,
  };
  const files = glob.sync('*', globOption);
  for (let i = 0, l = files.length; i < l; i++) {
    const filename = files[i];
    let from = resolve(sourcePath, filename);
    let to = resolve(distPath, filename);
    // transform .css to .acss
    if (extname(to) === '.css') to = to.replace(/\.css/, '.acss');
    copySync(from, to);
  }
  // todo: watch these files.

  const { pages } = appConfig;
  for (let i = 0, l = pages.length; i < l; i++) {
    new TransformerPage({
      rootContext: sourcePath,
      context: resolve(sourcePath, pages[i]),
      distRoot: distPath,
      distPagePath: resolve(distPath, pages[i], '..'),
      watch: enableWatch,
    });
  }

  const localHelperPath = resolve(__dirname, 'helpers');
  // In case of duplicated name.
  copySync(localHelperPath, resolve(distPath, '__helpers'));
  printLog(colors.green('复制 Helpers'), 'dist/helpers');

  /**
   * Judge whether a file path is belonging to a page.
   * @param relativeFilePath {String}
   * @return isPage {Boolean}
   */
  function isPage(relativeFilePath) {
    const fileNameWithoutExt = relativeFilePath.slice(0, -extname(relativeFilePath).length);
    return appConfig.pages.some((path) => path === fileNameWithoutExt);
  }
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
function ask(message) {
  const name = '_NAME_';
  return inquirer.prompt([
    { type: 'confirm', name, message }
  ]).then(answers => answers[name]);
}

module.exports = transformJSXToMiniProgram;
