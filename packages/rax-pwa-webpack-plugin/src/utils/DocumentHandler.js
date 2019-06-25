const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { createElement } = require('rax');
const renderer = require('rax-server-renderer');

const interopRequire = require('./interopRequire');
const getAssets = require('./getAssets');
const getWebpackNodeConfig = require('./getWebpackNodeConfig');

class DocumentHandler {
  constructor(options) {
    this.options = options;

    const { appDocument, appHtml, appDirectory } = this.options;
    this.documentJsFilePath;
    this.withDocumentJs = fs.existsSync(appDocument) || !fs.existsSync(appHtml);
    // Temp File
    this.tempHtmlFileName = '_document';
    this.tempHtmlFilePath = path.resolve(appDirectory, '.temp', this.tempHtmlFileName + '.js');

    if (this.withDocumentJs) {
      this.documentJsFilePath = fs.existsSync(appDocument) ? appDocument : require.resolve('rax-pwa/lib/Document');
    }
  }

  build(next) {
    const { appDirectory } = this.options;
    const webpackHtmlConfig = getWebpackNodeConfig(appDirectory);
    webpackHtmlConfig.entry[this.tempHtmlFileName] = this.documentJsFilePath;
    webpack(webpackHtmlConfig).run(() => {
      next('document');
    });
  }

  getDocument(compilation, appShellTemplate = '', skeletonTemplate = '', title = 'WebApp') {
    let _htmlValue;
    let _htmlPath;
    const _htmlAssets = getAssets(compilation);
    const { appHtml } = this.options;

    if (!this.withDocumentJs) {
      // Use public/index.html
      _htmlPath = appHtml;
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

      const jsTagStr = _htmlAssets.js.map(src => `<script src="${src}"></script>`).join('') || '';
      const cssTagStr = _htmlAssets.css.map(src => `<link rel="stylesheet" href="${src}" />`).join('') || '';
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
          pageData: JSON.stringify({}),
          pageHtml: appShellTemplate
        })
      );
      if (skeletonTemplate) {
        _htmlValue = _htmlValue.replace(
          '<script',
          `<script>${skeletonTemplate}</script><script`
        );
      }
    }
    return { html: _htmlValue, path: _htmlPath };
  }
}

module.exports = DocumentHandler;
