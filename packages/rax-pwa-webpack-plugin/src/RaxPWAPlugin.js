/**
 * PWA Plugin
 * Add or modify some project files according to the configuration of project app.json,
 * update the construction configuration, and achieve the purpose of experience enhancement
 *
 */


const fs = require('fs');
const path = require('path');

const AppShellHandler = require('./AppShellHandler');
const DocumentHandler = require('./DocumentHandler');

const _ = require('./res/util');
const getPagesConfig = require('./res/getPagesConfig');
const getEntryCodeStr = require('./res/getEntryCodeStr');

const PLUGIN_NAME = 'rax-pwa-webpack-plugin';

class RaxPWAPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { appConfig, pathConfig } = this.options;

    // Mark optimization function points on PWA
    let withSkeleton = false;
    const withAppShell = fs.existsSync(pathConfig.appShell);
    const withSSR = !!appConfig.ssr;
    const withSPA = !!appConfig.spa;
    const withDocumentJs = fs.existsSync(pathConfig.appDocument) || !fs.existsSync(pathConfig.appHtml);

    // Temp file
    const tempIndexFileName = 'tempIndex';
    const tempIndexFilePath = path.resolve(tempIndexFileName + '.js');

    // String template for injecting HTML
    let appShellTemplate = '';
    let skeletonTemplate = '';

    // Mark the current environment
    const isProductionLikeMode = compiler.options.mode === 'production' || !compiler.options.mode;

    const appShellHandler = new AppShellHandler({ pathConfig });
    const documentHandler = new DocumentHandler({ pathConfig });

    /**
     * Project Code pre-processing when SPA is turned on
     * 1. Update the project entry file from multiple to one main entry
     * 2. prepare the code for the main entry file
     * 3. prepare the skeleton map
     * 4. write temporary files, entry.
     */
    if (withSPA) {
      const pagesConfig = getPagesConfig(appConfig, pathConfig);
      const newEntry = {
        entry: tempIndexFilePath
      };

      // Dev mode for hot reload
      if (!isProductionLikeMode && withDocumentJs && fs.existsSync(pathConfig.appDocument)) {
        newEntry._document = pathConfig.appDocument;
      }

      const entryCodeStr = getEntryCodeStr({
        appConfig,
        pathConfig,
        pagesConfig,
        withSSR,
        withAppShell,
      });

      // Prepare the skeleton diagram code, match the routing information when the page is initialized,
      // and insert the skeleton diagram of the corresponding page into the blank area of the page
      skeletonTemplate += `
        var pathname = window.location.pathname;
        var hash = window.location.hash;
        var isMatched = function (regexp, type) {
          return "hash" === type ? regexp.test(hash.replace("#", "")) : "history" === type && regexp.test(pathname);
        };
      `;
      Object.keys(pagesConfig).forEach((pageName) => {
        if (pagesConfig[pageName].skeleton) {
          withSkeleton = true;
          skeletonTemplate += `
            if (isMatched(${pagesConfig[pageName]._regexp}, "${withSSR ? 'history' : 'hash'}")) {
              document.getElementById("root-page").innerHTML = '<img src="${pagesConfig[pageName].skeleton}"/>';
            }
          `;
        }
      });

      fs.writeFileSync(tempIndexFilePath, entryCodeStr);

      compiler.options.entry = newEntry;
    }

    /**
     * Replace code before Build
     * 1. Custom document/index.js compilation.
     * 2. Compile the App Shell file. The string node after render string is inserted into HTML.
     */
    compiler.hooks.beforeCompile.tapAsync(PLUGIN_NAME, (compilationParams, callback) => {
      if (withAppShell) {
        appShellHandler.build();
      }

      if (withDocumentJs) {
        documentHandler.build();
      }

      callback();
    });

    /**
     * Generate code that really works
     * 1. Insert the App Shell file into HTML
     * 2. Custom document/index.js handles HTML files into containers
     */
    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      // Process app shell
      if (withAppShell) {
        appShellTemplate = appShellHandler.getContent();
      }

      // Process html
      const document = documentHandler.getDocument(
        compilation, appShellTemplate, skeletonTemplate, appConfig.title
      );
      compilation.fileDependencies.add(document.path);
      compilation.assets['index.html'] = {
        source: () => document.html,
        size: () => document.html.length
      };

      // destroy
      if (isProductionLikeMode) {
        try {
          if (withAppShell) {
            appShellHandler.clearTempFile();
          }
          if (withDocumentJs) {
            documentHandler.clearTempFile();
          }
          if (withSPA) {
            fs.unlinkSync(tempIndexFilePath);
          }
        } catch (e) {
          // ignore
        }
      }
      callback();
    });
  }
}

module.exports = RaxPWAPlugin;