/**
 * Snapshot Plugin
 * Store the innerHTML of the root element when the page is onload, and we call this innerHTML as snapshot.
 * When you visit the same page, the snapshot will be rendered first, and then hydrate the root element.
 * PWA_SnapshotPlugin can make the page render faster.
 *
 * 1. save snapshot when onload
 * 2. innerHTML the snapshot when the page has its snapshot
 */

const { RawSource } = require('webpack-sources');
const { minify } = require('html-minifier');

const PLUGIN_NAME = 'PWA_SnapshotPlugin';


module.exports = class SnapshotPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const config = compiler.options;
    const { snapshot } = this.options;
    const withSSR = process.env.RAX_SSR === 'true';

    if (!snapshot) {
      // Exit if no htmlShot config
      return;
    }

    try {
      // Told universal-app-shell-loader to use hydrate
      const targetIdx = config.entry.index.findIndex(item => ~item.indexOf('UniversalAppShellLoader') && /\/src\/app\.js$/.test(item));
      config.entry.index[targetIdx] = config.entry.index[targetIdx].replace('type=web', 'type=web&&PWASnapshot=true');
    } catch (e) {
      console.warn('Hydrate snapshot failed: your Rax engineering may out of date!');
    }

    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      const processSnapshot = `
        var pathname = window.location.pathname;
        var hash = window.location.hash.replace('#', '') || '/';
        var storageKey = '__INITIAL_HTML_' + ${withSSR ? 'pathname' : 'hash'} + '__';
       
        var __INITIAL_HTML__ = localStorage.getItem(storageKey);
        
        if(__INITIAL_HTML__) {
          document.getElementById('root').innerHTML = __INITIAL_HTML__;
        }
      
        window.addEventListener("load", function (event) {
          localStorage.setItem(storageKey, this.document.getElementById('root').innerHTML);
        });
      `;

      // In order to rendering faster, using inline script.
      compilation.assets['web/index.html'] = new RawSource(
        minify(
          compilation.assets['web/index.html'].source().replace('<script ', `<script>${processSnapshot}</script><script `),
          { minifyJS: true }
        )
      );
      callback();
    });
  }
};