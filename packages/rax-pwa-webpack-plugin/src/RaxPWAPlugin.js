
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { createElement } = require('rax');
const renderer = require('rax-server-renderer');


const _ = require('./utils/index');
const getAssets = require('./utils/getAssets');
const getConfig = require('./utils/getConfig');
const getPagesConfig = require('./utils/getPagesConfig');
const { getEntryCodeStr, getRouterCodeStr } = require('./utils/SPACodeStr');

const PLUGIN_NAME = 'rax-pwa-webpack-plugin';


class RaxPWAPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { appConfig, pathConfig } = this.options;

    // mark PWA checklist 
    const withAppShell = fs.existsSync(pathConfig.appShell);
    const withSSR = !!appConfig.ssr;
    const withSPA = !!appConfig.spa;
    const withSPAPageSplitting = appConfig.spa && appConfig.spa.pageSplitting;
    const withCache = !!appConfig.cache;

    // temp files
    const tempShellFileName = 'tempShell';
    const tempShellFilePath = path.resolve(pathConfig.appBuild, tempShellFileName + '.js');
    const tempIndexFileName = 'tempIndex';
    const tempIndexFilePath = path.resolve(tempIndexFileName + '.js');
    const tempRouterFileName = 'tempRouter';
    const tempRouterFilePath = path.resolve(tempRouterFileName + '.js');

    // string elements
    let appShellTemplate = '';
    let skeletonTemplate = '';

    /**
     * update entry
     * 
     */
    if (withSPA) {
      const pagesConfig = getPagesConfig(appConfig, pathConfig);
      const newEntry = {
        // pathConfig.appIndexJs
        index: tempIndexFilePath
      };

      const entryCodeStr = getEntryCodeStr({
        pathConfig,
        withAppShell,
        tempRouterFilePath
        // : pathConfig.appSrc + '/_router'
      });
      const routerCodeStr = getRouterCodeStr({
        appConfig,
        pathConfig,
        pagesConfig,
        withSSR,
        withSPAPageSplitting
      });

      console.log(routerCodeStr);
      // skeletonTemplate = SPAInfo.skeletonTemplate;
      fs.writeFileSync(tempIndexFilePath, entryCodeStr);
      fs.writeFileSync(tempRouterFilePath, routerCodeStr);

      compiler.options.entry = newEntry
    }


    compiler.hooks.beforeCompile.tapAsync(PLUGIN_NAME, (compilationParams, callback) => {

      /**
       * update file
       * 
       */
      if (withAppShell) {
        const webpackConfig = getConfig(pathConfig);
        webpackConfig.entry[tempShellFileName] = pathConfig.appShell;
        webpack(webpackConfig).run((err) => {
          if (err) {
            return false;
          }
          appShellTemplate = renderer.renderToString(
            createElement(_.interopRequire(require(tempShellFilePath)), {
              Component: createElement('div', { id: 'root-page' })
            })
          );
          callback();
        });
      }
    });

    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      console.log(getAssets(compilation));

      // todo  write html file
      console.log(appShellTemplate);

      // destroy
      try {
        if (withAppShell) {
          fs.unlinkSync(tempShellFilePath);
        }
        if (withSPA) {
          fs.unlinkSync(tempIndexFilePath);
          // fs.unlinkSync(tempRouterFileName);
        }
      } catch (e) {
        // ignore 
      }
      callback();
    });

  }
}

module.exports = RaxPWAPlugin;