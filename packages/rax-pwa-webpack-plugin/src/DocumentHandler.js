const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { createElement } = require('rax');
const renderer = require('rax-server-renderer');

const interopRequire = require('./res/interopRequire');
const getAssets = require('./res/getAssets');
const getWebpackNodeConfig = require('./res/getWebpackNodeConfig');

class DocumentHandler {
  constructor(options) {
    this.options = options;

    const { pathConfig } = this.options;
    this.documentJsFilePath;
    this.withDocumentJs = fs.existsSync(pathConfig.appDocument) || !fs.existsSync(pathConfig.appHtml);
    // Temp File
    this.tempHtmlFileName = 'tempHtml';
    this.tempHtmlFilePath = path.resolve(pathConfig.appBuild, this.tempHtmlFileName + '.js');

    if (this.withDocumentJs) {
      this.documentJsFilePath = fs.existsSync(pathConfig.appDocument) ?
        pathConfig.appDocument :
        require.resolve('rax-pwa/lib/Document');
    }
  }

  build(callback) {
    const { pathConfig } = this.options;
    const webpackHtmlConfig = getWebpackNodeConfig(pathConfig);
    webpackHtmlConfig.entry[this.tempHtmlFileName] = this.documentJsFilePath;
    webpack(webpackHtmlConfig).run(() => {
      callback();
    });
  }

  getDocument(compilation, appShellTemplate = '', skeletonTemplate = '', title = 'WebApp') {
    let _htmlValue;
    let _htmlPath;
    const _htmlAssets = getAssets(compilation);
    const { pathConfig } = this.options;

    if (!this.withDocumentJs) {
      // Use public/index.html
      _htmlPath = pathConfig.appHtml;
      _htmlValue = fs.readFileSync(_htmlPath, 'utf8');
      _htmlValue = _htmlValue.replace(
        /<div(.*?) id=\"root\">(.*?)<\/div>/,
        `<div id="root">${appShellTemplate}</div>`
      );

      if (skeletonTemplate) {
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
      // Use document.js
      _htmlPath = this.documentJsFilePath;
      _htmlValue = renderer.renderToString(
        createElement(interopRequire(eval(fs.readFileSync(this.tempHtmlFilePath, 'utf-8'))), {
          scripts: _htmlAssets.js,
          styles: _htmlAssets.css,
          title: title,
          pageData: {},
          pageHtml: appShellTemplate
        })
      );
    }
    return { html: _htmlValue, path: _htmlPath };
  }

  clearTempFile() {
    fs.unlinkSync(this.tempHtmlFilePath);
  }
}

module.exports = DocumentHandler;