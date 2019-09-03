/**
 * Save To Desktop Plugin
 * https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
 * 1. create manifest.json
 * 2. process icon file to multi-size
 * 3. set HTML header tags
 * 4. support iOS
 */


const path = require('path');
const jimp = require('jimp');
const mime = require('mime');
const { existsSync } = require('fs');
const { RawSource } = require('webpack-sources');

const PLUGIN_NAME = 'PWA_SaveToDesktopPlugin';

const defaultManifest = {
  start_url: '.',
  display: 'standalone'
};

const iconSizes = [96, 128, 180, 256, 512];
const supportedMIMETypes = [jimp.MIME_PNG, jimp.MIME_JPEG, jimp.MIME_BMP];

module.exports = class SaveToDesktopPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { manifest, context } = this.options;

    if (!manifest) {
      // Exit if no manifest config
      return;
    }
    const { rootDir, userConfig } = context;
    const publicPath = userConfig.publicPath || '/';
    let tags = `<link rel="manifest" href="${publicPath}web/manifest.json" />`;

    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      const icons = [];
      const iconFile = path.join(rootDir, manifest.icon || '');
      const mimeType = mime.getType(iconFile);

      if (!manifest.icon) throw new Error('Can not find icon in manifest');
      if (!existsSync(iconFile)) throw new Error(`File '${iconFile}' is not exists, please check.`);
      if (!supportedMIMETypes.includes(mimeType)) throw new Error(`File '${iconFile}' is not support, supported MIME types are "image/png", "image/jpeg", "image/bmp".`);
      // Process image
      jimp.read(iconFile, (err, img) => {
        if (err) throw new Error(`It was not possible to read '${iconFile}'.`);
        // Resize image to specific size
        iconSizes.forEach((currentSize) => {
          const dimensions = `${currentSize}x${currentSize}`;
          const fileName = `public/icon_${dimensions}.${mime.getExtension(mimeType)}`;
          const iconPublicUrl = publicPath + fileName;
          // Resize image
          img.resize(currentSize, currentSize).getBuffer(mimeType, (resizeErr, buffer) => {
            if (resizeErr) throw new Error(`It was not possible to retrieve buffer of '${iconFile}'.`);
            compilation.assets[fileName] = new RawSource(buffer);
          });
          // Add icon
          icons.push({
            src: iconPublicUrl,
            sizes: dimensions,
            type: mimeType
          });
          // Write tags for iOS
          tags += `<link rel="apple-touch-icon" sizes="${dimensions}" href="${iconPublicUrl}">`;
        });

        // Write manifest.json
        const manifestJSONValue = {
          ...defaultManifest,
          ...manifest,
          icons,
        };
        delete manifestJSONValue.icon;
        compilation.assets['web/manifest.json'] = new RawSource(JSON.stringify(manifestJSONValue));
        // Generate Html tags
        compilation.assets['web/index.html'] = new RawSource(
          compilation.assets['web/index.html'].source().replace('<head>', `<head>${tags}`)
        );
        callback();
      });
    });
  }
};