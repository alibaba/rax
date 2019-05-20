const {
  existsSync,
  mkdirpSync,
  removeSync,
} = require('fs-extra');
const colors = require('colors');
const { createApp } = require('./transformer/App');
const { startWatching } = require('./transformer/Watch');
const { isDirectory } = require('./utils/file');
const { printLog, ask } = require('./utils/log');

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
  createApp(sourcePath, distPath);

  if (enableWatch) {
    printLog(colors.green('将监听以下路径的文件变更'), sourcePath);
    startWatching(sourcePath, distPath);
  }

}

module.exports = transformJSXToMiniProgram;
