'use strict';

const imageSize = require('image-size');
const mimes = require('../mimes.json');

function getMime(path) {
  const extension = path.split('.').pop().toLowerCase();
  const mime = mimes[extension];
  if (!mime) {
    throw new Error('Unsupported type of image of extension ' + extension + ': ' + path);
  }
  return mime;
}

module.exports = function base64ImageLoader(content) {
  this.cacheable && this.cacheable();
  const dimensions = {};
  try {
    const _dimensions = imageSize(content);
    Object.assign(dimensions, _dimensions);
  } catch (err) {}
  return `module.exports = {
    uri: "data:${getMime(this.resourcePath)};base64,${content.toString('base64')}",
    width: ${dimensions.width || 'undefined'},
    height: ${dimensions.height || 'undefined'}
  }`;
};
module.exports.raw = true;
