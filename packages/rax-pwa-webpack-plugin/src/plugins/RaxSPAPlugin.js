/**
 * Rax SPA Plugin
 * Compile the Router and generate the SPA entry file.
 *
 */

const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const { isProductionMode } = require('../env');
const mkTempDir = require('../mkTempDir');
const getSPAPagesConfig = require('../getSPAPagesConfig');
const getSPAEntryCodeStr = require('../getSPAEntryCodeStr');


class RaxPWAPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { appConfig, pathConfig } = this.options;

    // Mark optimization function points on PWA
    const withAppShell = fs.existsSync(pathConfig.appShell);
    const withSSR = !!appConfig.ssr;
    const withSPA = !!appConfig.spa;
    const withDocumentJs = fs.existsSync(pathConfig.appDocument) || !fs.existsSync(pathConfig.appHtml);

    // Temp file
    const tempIndexFileName = '_index';
    const tempIndexFilePath = path.resolve(pathConfig.appDirectory, '.temp', tempIndexFileName + '.js');

    // Mark the current environment
    const isProductionLikeMode = isProductionMode(compiler);

    // Make temp directory
    mkTempDir(pathConfig.appDirectory);

    /**
     * Project Code pre-processing when SPA is turned on
     * 1. Update the project entry file from multiple to one main entry
     * 2. prepare the code for the main entry file
     * 3. prepare the skeleton map
     * 4. write temporary files, entry.
     */
    if (withSPA) {
      const pagesConfig = getSPAPagesConfig(appConfig, pathConfig);
      const newEntry = {
        entry: tempIndexFilePath
      };

      // Dev mode for hot reload
      if (!isProductionLikeMode && withDocumentJs && fs.existsSync(pathConfig.appDocument)) {
        newEntry._document = pathConfig.appDocument;
      }

      const entryCodeStr = getSPAEntryCodeStr({
        appConfig,
        pathConfig,
        pagesConfig,
        withSSR,
        withAppShell,
      });

      fs.writeFileSync(tempIndexFilePath, entryCodeStr);

      compiler.options.entry = newEntry;
    } else if (withSSR) {
      // SSR entry add ClientLoader
      const ClientLoader = require.resolve('../loaders/ClientLoader.js');
      const entries = compiler.options.entry;
      Object.keys(entries).forEach((key) => {
        const mainEntryFile = entries[key][0];
        if (mainEntryFile.indexOf(ClientLoader) === -1) {
          entries[key][0] = `${ClientLoader}?${qs.stringify({ ssr: true, withAppShell: withAppShell })}!${mainEntryFile}`;
        }
      });
    }
  }
}

module.exports = RaxPWAPlugin;
