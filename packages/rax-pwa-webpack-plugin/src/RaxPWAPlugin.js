/**
 * PWA Plugin 
 * Add or modify some project files according to the configuration of project app. json, 
 * update the construction configuration, and achieve the purpose of experience enhancement
 * 
 */


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

    // Mark optimization function points on PWA
    let withSkeleton = false;
    const withAppShell = fs.existsSync(pathConfig.appShell);
    const withSSR = !!appConfig.ssr;
    const withSPA = !!appConfig.spa;
    const withSPAPageSplitting = appConfig.spa && appConfig.spa.pageSplitting;
    const withDocumentJs = fs.existsSync(pathConfig.appDocument) || !fs.existsSync(pathConfig.appHtml);

    // temp files
    const tempShellFileName = 'tempShell';
    const tempShellFilePath = path.resolve(pathConfig.appBuild, tempShellFileName + '.js');
    const tempIndexFileName = 'tempIndex';
    const tempIndexFilePath = path.resolve(tempIndexFileName + '.js');
    const tempRouterFileName = 'tempRouter';
    const tempRouterFilePath = path.resolve(tempRouterFileName + '.js');
    const tempHtmlFileName = 'tempHtml';
    const tempHtmlFilePath = path.resolve(pathConfig.appBuild, tempHtmlFileName + '.js');

    // String template for injecting HTML
    let appShellTemplate = '';
    let skeletonTemplate = '';

    // Mark the current environment
    const isProductionLikeMode = compiler.options.mode === 'production' || !compiler.options.mode;

    let documentJsFilePath = '';
    if (withDocumentJs) {
      documentJsFilePath = fs.existsSync(pathConfig.appDocument) ?
        pathConfig.appDocument :
        require.resolve('rax-pwa/lib/Document');
    }

    /**
     * Project Code pre-processing when SPA function is turned on
     * 1. Update the project entry file from multiple to one main entry
     * 2. prepare the code for the main entrance and router
     * 3. prepare the skeleton map
     * 4. write temporary files, index and router.
     */
    if (withSPA) {
      const pagesConfig = getPagesConfig(appConfig, pathConfig);
      const newEntry = {
        index: tempIndexFilePath
      };

      // Dev mode for hot reload
      if (!isProductionLikeMode && withDocumentJs) {
        newEntry._document = documentJsFilePath;
      }

      const entryCodeStr = getEntryCodeStr({
        pathConfig,
        withAppShell,
        tempRouterFilePath
      });
      const routerCodeStr = getRouterCodeStr({
        appConfig,
        pathConfig,
        pagesConfig,
        withSSR,
        withSPAPageSplitting
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
      })

      fs.writeFileSync(tempIndexFilePath, entryCodeStr);
      fs.writeFileSync(tempRouterFilePath, routerCodeStr);

      compiler.options.entry = newEntry
    }

    /**
     * Replace code before Build
     * 1. Compile the App Shell file. The string node after render string is inserted into HTML
     * 2. Custom document/index. js compilation. Render tostring becomes the HTML file of the container
     */
    compiler.hooks.beforeCompile.tapAsync(PLUGIN_NAME, (compilationParams, callback) => {
      if (withAppShell) {
        const webpackShellConfig = getConfig(pathConfig);
        webpackShellConfig.entry[tempShellFileName] = pathConfig.appShell;
        webpack(webpackShellConfig).run((err) => {
          if (err) {
            return false;
          }
          appShellTemplate = renderer.renderToString(
            createElement(_.interopRequire(require(tempShellFilePath)), {
              Component: () => createElement('div', { id: 'root-page' })
            })
          );
          // remove cache
          _.purgeRequireCache(tempShellFilePath);
          callback();
        });
      } else {
        callback();
      }

      if (withDocumentJs) {
        const webpackHtmlConfig = getConfig(pathConfig);
        webpackHtmlConfig.entry[tempHtmlFileName] = documentJsFilePath;
        webpack(webpackHtmlConfig).run();
      }
    });

    /**
     * Generate code that really works
     * 1. Insert the App Shell file into HTML
     * 2. Custom document/index. js handles HTML files into containers
     */
    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      let _htmlValue;
      let _htmlPath;
      const _htmlAssets = getAssets(compilation);

      if (!withDocumentJs) {
        _htmlPath = pathConfig.appHtml;
        _htmlValue = fs.readFileSync(_htmlPath, 'utf8');
        _htmlValue = _htmlValue.replace(
          '<div id="root"></div>',
          `<div id="root">${appShellTemplate}</div>`
        );

        if (withSkeleton) {
          _htmlValue = _htmlValue.replace(
            '</body>',
            `<script>${skeletonTemplate}</script></body>`
          );
        }

        const jsTagStr = _htmlAssets.js.map(src => `<script src="${src}"></script>`) || '';
        const cssTagStr = _htmlAssets.css.map(src => `<link rel="stylesheet" href="${src}" />`) || '';
        _htmlValue = _htmlValue
          .replace('</head>', `${cssTagStr}</head>`)
          .replace('</body>', `${jsTagStr}</body>`);
      } else {
        _htmlPath = documentJsFilePath;
        _htmlValue = renderer.renderToString(
          createElement(_.interopRequire(require(tempHtmlFilePath)), {
            scripts: _htmlAssets.js,
            styles: _htmlAssets.css,
            title: appConfig.title,
            pageData: {},
            pageHtml: appShellTemplate
          })
        );
        // remove cache
        _.purgeRequireCache(tempHtmlFilePath);
      }

      compilation.fileDependencies.add(_htmlPath);
      compilation.assets['index.html'] = {
        source: () => _htmlValue,
        size: () => _htmlValue.length
      };

      // destroy
      if (isProductionLikeMode) {
        try {
          if (withAppShell) {
            fs.unlinkSync(tempShellFilePath);
          }
          if (withSPA) {
            fs.unlinkSync(tempIndexFilePath);
            fs.unlinkSync(tempRouterFilePath);
          }
          if (withDocumentJs) {
            fs.unlinkSync(tempHtmlFilePath);
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