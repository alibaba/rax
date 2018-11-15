const { resolve } = require('path');
const { readFileSync, existsSync } = require('fs');
const { stringifyRequest } = require('loader-utils');

const pageLoaderPath = require.resolve('./page-loader');

module.exports = function appLoader(content) {
  let source = content;
  const configPath = this.resourcePath.replace(/app\.js$/, 'manifest.json');

  let loadPagesContent = '';
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    this.addDependency(configPath);
    const pages = Object.keys(config.pages || {});
    for (let i = 0, l = pages.length; i < l; i ++) {
      const pageName = pages[i];
      const pagePath = resolve(this.rootContext, config.pages[pageName]);
      loadPagesContent += `require(${stringifyRequest(this, pageLoaderPath + `?pageName=${pageName}!` + pagePath)});`;
    }
  }

  return source + loadPagesContent;
};
