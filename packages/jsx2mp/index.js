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
const moduleResolve = require('./utils/moduleResolve');

/**
 * Transform a jsx project.
 * @param sourcePath {String} Absolute path to source path.
 * @param distPath {String} Absolute distPath to source path.
 * @param options {object} Watch file changes.
 */
async function transformJSXToMiniProgram(sourcePath, distPath, options = {}) {
  const { enableWatch, type, dist, entry = 'index' } = options;

  if (type === 'project') {
    // Build Rax Universal App project.
    if (!isDirectory(sourcePath)) throw new Error('Not a valid path.');
    if (existsSync(distPath)) {
      const needClean = await ask(`Found that the target directory ${dist} already exists. Do you need to clean it up?`);
      if (needClean) {
        removeSync(distPath);
        printLog(colors.green('Clean up'), dist + '/');
      }
    }

    // Make sure dist directory created.
    mkdirpSync(distPath);
    printLog(colors.green('Created directory'), dist + '/');
    createApp(sourcePath, distPath);

    if (enableWatch) {
      printLog(colors.green('Will listen for file changes for the following paths'), sourcePath);
      startWatching(sourcePath, distPath);
    }
  } else if (type === 'component') {
    // Build Rax Component
    const { createComponent } = require('./transformer/Component');
    const resolvedEntry = moduleResolve(sourcePath + '/index.js', './' + entry, '.js') || moduleResolve(sourcePath + '/index.js', './' + entry, '.jsx');
    if (resolvedEntry) {
      createComponent(process.cwd(), distPath, {
        index: resolvedEntry
      });
      if (enableWatch) {
        // TODO: enable watch mode for component build.
        console.warn('Watch mode not supported in comopnent build for now.');
      }
    } else {
      console.error(`Can not get right entry of ${entry}, please check.`);
    }
  } else {
    console.error('Can not recognize type of ' + type + ', please check.');
    process.exit(1);
  }
}

module.exports = transformJSXToMiniProgram;
