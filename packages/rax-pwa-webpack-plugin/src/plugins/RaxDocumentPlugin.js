/**
 * Rax Document Plugin
 * Generate HTML by compiling document/index.js and App Shell
 *
 */

const fs = require('fs');
const minify = require('html-minifier').minify;
const { isProductionMode } = require('../env');
const mkTempDir = require('../mkTempDir');
const getSPAPagesConfig = require('../getSPAPagesConfig');
const AppShellHandler = require('../AppShellHandler');
const DocumentHandler = require('../DocumentHandler');

const PLUGIN_NAME = 'RaxDocumentPlugin';

class RaxDocumentPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { appConfig, pathConfig } = this.options;

    // Mark optimization function points on PWA
    let withSkeleton = false;
    const withSPA = !!appConfig.spa;
    const withSSR = !!appConfig.ssr;
    const withAppShell = fs.existsSync(pathConfig.appShell);
    const withDocumentJs = fs.existsSync(pathConfig.appDocument) || !fs.existsSync(pathConfig.appHtml);

    // String template for injecting HTML
    let appShellTemplate = '';
    let skeletonTemplate = '';

    // Mark the current environment
    const isProductionLikeMode = isProductionMode(compiler);

    const appShellHandler = new AppShellHandler({
      appDirectory: pathConfig.appDirectory,
      appShell: pathConfig.appShell
    });
    const documentHandler = new DocumentHandler({
      appDocument: pathConfig.appDocument,
      appHtml: pathConfig.appHtml,
      appDirectory: pathConfig.appDirectory
    });

    // Make temp directory
    mkTempDir(pathConfig.appDirectory);

    if (withSPA) {
      const pagesConfig = getSPAPagesConfig(appConfig, pathConfig);

      // Prepare the skeleton diagram code, match the routing information when the page is initialized,
      // and insert the skeleton diagram of the corresponding page into the blank area of the page
      Object.keys(pagesConfig).forEach((pageName) => {
        if (pagesConfig[pageName].skeleton) {
          withSkeleton = true;
          if (pageName === 'index') {
            skeletonTemplate += `
              if (isPathMatched(${pagesConfig[pageName]._regexp}, "${withSSR ? 'history' : 'hash'}") || (${withSSR} && pathname === '/') || (${!withSSR} && hash === '/')) {
                document.getElementById("${withAppShell ? 'root-page' : 'root'}").innerHTML = '<img src="${pagesConfig[pageName].skeleton}"/>';
              }
            `;
          } else {
            skeletonTemplate += `
              if (isPathMatched(${pagesConfig[pageName]._regexp}, "${withSSR ? 'history' : 'hash'}")) {
                document.getElementById("${withAppShell ? 'root-page' : 'root'}").innerHTML = '<img src="${pagesConfig[pageName].skeleton}"/>';
              }
            `;
          }
        }
      });
      if (withSkeleton) {
        skeletonTemplate = `
          var pathname = window.location.pathname + window.location.search;
          var hash = window.location.hash.replace("#", "");
          var isPathMatched = function (regexp, type) {
            return "hash" === type ? regexp.test(hash) : "history" === type && regexp.test(pathname);
          };
        ` + skeletonTemplate;
      }
    }

    /**
     * Replace code before Build
     * 1. Custom document/index.js compilation.
     * 2. Compile the App Shell file. The string node after render string is inserted into HTML.
     */
    compiler.hooks.beforeCompile.tapAsync(PLUGIN_NAME, (compilationParams, callback) => {
      // callback must run only once
      let callbackCalled = false;
      const runCallback = () => {
        if (callbackCalled) return;
        callbackCalled = true;
        callback();
      };

      if (!withSSR && (withAppShell || withDocumentJs)) {
        if (withAppShell && withDocumentJs) {
          let appShellReady = false;
          let documentReady = false;
          function next(type) {
            if (type === 'appShell') {
              appShellReady = true;
            }
            if (type === 'document') {
              documentReady = true;
            }
            if (appShellReady && documentReady) {
              runCallback();
            }
          }
          withAppShell && appShellHandler.build(next);
          withDocumentJs && documentHandler.build(next);
        } else {
          withAppShell && appShellHandler.build(runCallback);
          withDocumentJs && documentHandler.build(runCallback);
        }
      } else {
        runCallback();
      }
    });

    /**
     * Generate code that really works
     * 1. Insert the App Shell file into HTML
     * 2. Custom document/index.js handles HTML files into containers
     */
    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      if (!withSSR) {
        // Process app shell
        if (withAppShell) {
          appShellTemplate = appShellHandler.getContent();
        }

        // Process html
        let htmlCode;
        const document = documentHandler.getDocument(
          compilation, appShellTemplate, skeletonTemplate, appConfig.title
        );

        if (isProductionLikeMode) {
          // https://github.com/kangax/html-minifier#options-quick-reference
          htmlCode = minify(document.html, {
            minifyJS: true,
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
          });
        } else {
          htmlCode = document.html;
        }

        // add index.html
        compilation.fileDependencies.add(document.path);
        compilation.assets['index.html'] = {
          source: () => htmlCode,
          size: () => htmlCode.length
        };
      }

      callback();
    });
  }
}

module.exports = RaxDocumentPlugin;
