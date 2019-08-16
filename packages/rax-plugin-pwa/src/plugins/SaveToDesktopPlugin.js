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

const iconSizes = [96, 128, 192, 256, 384, 512];
const supportedMimeTypes = [jimp.MIME_PNG, jimp.MIME_JPEG, jimp.MIME_BMP];


module.exports = class SaveToDesktopPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { manifest, context } = this.options
    const { rootDir, userConfig } = context;
    const publicPath = userConfig.publicPath || '/';
    // exit if no manifest config
    if (!manifest) return;

    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      // process image
      const icons = [];
      const iconFile = path.join(rootDir, manifest.icon || '');
      const mimeType = mime.getType(iconFile);
      if (!manifest.icon) throw new Error('Can not find icon in manifest');
      if (!existsSync(iconFile)) throw new Error(`File '${iconFile}' is not exists, please check.`);
      if (!supportedMimeTypes.includes(mimeType)) throw new Error(`File '${iconFile}' is not support, supported MIME types are "image/png", "image/jpeg", "image/bmp".`);
      jimp.read(iconFile, (err, img) => {
        if (err) throw new IconError(`It was not possible to read '${iconFile}'.`)
        iconSizes.forEach((currentSize) => {
          const dimensions = `${currentSize}x${currentSize}`;
          const fileName = `icon_${dimensions}.${mime.getExtension(mimeType)}`;
          img.resize(currentSize, currentSize).getBuffer(mimeType, (resizeErr, buffer) => {
            if (resizeErr) throw new Error(`It was not possible to retrieve buffer of '${iconFile}'.`);
            compilation.assets[fileName] = new RawSource(buffer);
          });

          icons.push({
            src: publicPath + fileName,
            sizes: dimensions,
            type: mimeType
          })
        });

        // write manifest.json
        const manifestJsonValue = {
          ...defaultManifest,
          ...manifest,
          icons,
        };
        delete manifestJsonValue.icon;
        compilation.assets['manifest.json'] = new RawSource(JSON.stringify(manifestJsonValue));
        callback();
      });
    });
  }
}