const { readFileSync, existsSync, lstatSync, copySync, mkdirpSync, ensureFileSync, writeFileSync, removeSync, readJSONSync, writeJSONSync } = require('fs-extra');
const { resolve, relative, extname, dirname } = require('path');
const colors = require('colors');
const chokidar = require('chokidar');
const transformJSX = require('./transformJSX');

const JSX_FILE = '.jsx';
const JS_FILE = '.js';
const STYLE_FILE = '.css';
const TEMPLATE_FILE = '.axml';
const CONFIG_FILE = '.json';

function startWatching(sourcePath, distPath, onFileChange) {
  const watcherPaths = [sourcePath];
  const watcher = chokidar.watch(watcherPaths, {
    ignored: [/(^|[/\\])\../, distPath],
    persistent: true,
    ignoreInitial: false,
  });
  printLog(colors.green('监听以下路径变更'), watcherPaths);

  return watcher
    .on('add', onFileChange)
    .on('change', onFileChange);
}


/**
 * Transform a jsx file
 * @param sourcePath {String} Absolute path to source path.
 * @param distPath {String} Absolute distPath to source path.
 */
module.exports = function transformJSXToMiniProgram(sourcePath, distPath) {
  if (!isDirectory(sourcePath)) throw new Error('Not a valid path.');

  if (existsSync(distPath)) {
    // TODO: 提示是否需要删除
  }

  const appConfigPath = resolve(sourcePath, 'app.json');
  if (!existsSync(appConfigPath)) {
    throw new Error('app.json should exists.');
  }
  const appConfig = readJSONSync(appConfigPath);

  mkdirpSync(distPath);
  printLog(colors.green('创建目录'), 'dist/');
  startWatching(sourcePath, distPath, handleFileChange);

  const localHelperPath = resolve(__dirname, 'helpers');
  // In case of duplicated name.
  copySync(localHelperPath, resolve(distPath, '__helpers'));
  printLog(colors.green('复制 Helpers'), 'dist/helpers');

  function handleFileChange(sourceFilePath) {
    // Only handle files.
    if (isDirectory(sourceFilePath)) return;

    let relativePath = relative(sourcePath, sourceFilePath);
    let distFilePath = resolve(distPath, relativePath);

    // Make sure dist file's directory is created.
    mkdirpSync(dirname(distFilePath));

    switch (extname(sourceFilePath)) {
      case JSX_FILE: {
        const jsxCode = getFileContent(sourceFilePath);
        const { template, jsCode } = transformJSX(jsxCode);

        if (isPage(relativePath)) {
          const distFileDir = resolve(dirname(distFilePath), 'components');
          mkdirpSync(distFileDir);

          const distComponentTemplateFilePath = resolve(distFileDir, 'page.axml');
          writeFileSync(distComponentTemplateFilePath, template);

          const distComponentConfigFilePath = resolve(distFileDir, 'page.json');
          writeJSONSync(distComponentConfigFilePath, { component: true });

          const distComponentJSFilePath = resolve(distFileDir, 'page.js');
          writeFileSync(distComponentJSFilePath, jsCode);

          const distPageTemplateFilePath = distFilePath.replace(JSX_FILE, TEMPLATE_FILE);
          writeFileSync(distPageTemplateFilePath, '<page></page>');
          printLog(colors.green('生成模板'), `${relativePath.replace(JSX_FILE, TEMPLATE_FILE)}`);
        } else {

        }

        break;
      }

      case JS_FILE: {
        copySync(sourceFilePath, distFilePath);
        printLog(colors.green('复制 JS'), `${relativePath} -> dist/${relativePath}`);
        break;
      }

      case STYLE_FILE: {
        let distRelativePath = relativePath.replace(STYLE_FILE, '.acss');
        distFilePath = distFilePath.replace(STYLE_FILE, '.acss');
        copySync(sourceFilePath, distFilePath);

        printLog(colors.green('复制样式'), `${relativePath} -> dist/${distRelativePath}`);
        break;
      }

      case CONFIG_FILE: {
        if (isPage(relativePath)) {
          const pageConfig = readJSONSync(sourceFilePath);
          const usingComponents = pageConfig.usingComponents = pageConfig.usingComponents || {};
          usingComponents.page = './components/page'; // Add a page component config.
          writeJSONSync(distFilePath, pageConfig);
        } else {
          copySync(sourceFilePath, distFilePath);
        }
        printLog(colors.green('复制配置'), `${relativePath} -> dist/${relativePath}`);
        break;
      }

      default: {
        copySync(sourceFilePath, distFilePath);
        printLog(colors.green('复制文件'), `${relativePath} -> dist/${relativePath}`);
      }
    }
  }

  /**
   * Judge whether a file path is belonging to a page.
   * @param relativeFilePath {String}
   * @return isPage {Boolean}
   */
  function isPage(relativeFilePath) {
    const fileNameWithoutExt = relativeFilePath.slice(0, -extname(relativeFilePath).length);
    return appConfig.pages.some((path) => path === fileNameWithoutExt);
  }
};

function getFileContent(filepath) {
  return readFileSync(filepath, 'utf-8');
}

function isDirectory(path) {
  return lstatSync(path).isDirectory();
}

function printLog(...logs) {
  console.log.apply(console, logs);
}
