import isCdnImage from './isCdnImage';
import isOSSImage from './isOSSImage';
import removeUrlScheme from './removeScheme';
import replaceUrlDomain from './replaceDomain';
import scaling from './scaling';
import webpImage from './webp';
import compress from './compress';

const REG_IMG_SUFFIX = /_(\d+x\d+|cy\d+i\d+|sum|m|b)?(xz|xc)?((?:q\d+)?(?:s\d+)?)(\.jpg)?(_\.webp)?$/i;

/*
TODO
缩放剪裁(xz) _100x100xz.jpg @100h_100w_1e
非缩放剪裁(xc) _100x100xc.jpg  @100-50-0-0a
*/

/**
 *
 * @param {String} uri
 * @param {Object} config
 *    scalingWidth
 *    webp
 *    compressSuffix
 *    removeScheme
 *    replaceDomain
 * @returns {String} newUrl
 */
export default function(uri, config) {
  const {
    scalingWidth,
    webp,
    compressSuffix,
    quality,
    acutance,
    removeScheme,
    replaceDomain,
    ignoreGif,
    ignorePng
  } = config;

  let newUrl = uri;
  if (typeof uri === 'string') {
    let ret = isCdnImage(uri);

    // is cdn image
    if (ret) {
      const isOSSImg = isOSSImage(uri);
      const host = ret[1];
      const path = ret[2];
      let suffixRet = path.match(REG_IMG_SUFFIX) || [];
      const notGif = !~path.indexOf('gif') && !~path.indexOf('GIF') || !ignoreGif;
      const notPng = !~path.indexOf('png') && !~path.indexOf('png') || !ignorePng;

      let scalingSuffix = suffixRet[1] || '';
      if (
        scalingWidth && notGif
      ) {
        scalingSuffix = scaling(scalingWidth, isOSSImg) || scalingSuffix;
      }

      // webp
      let webpSuffix = suffixRet[5] || '';
      if (
        webp && notGif
      ) {
        webpSuffix = webpImage(isOSSImg) || webpSuffix;
      }

      let _compressSuffix = suffixRet[3] || '';
      if (
        (compressSuffix || quality || acutance) && notGif && notPng
      ) {
        _compressSuffix = compress(
          compressSuffix,
          quality,
          acutance,
          isOSSImg
        ) || _compressSuffix;
      }

      let cut = scalingSuffix ? suffixRet[2] || '' : '';
      let suffix = scalingSuffix || _compressSuffix ? suffixRet[4] || '.jpg' : '';
      let prev = scalingSuffix || _compressSuffix ? '_' : '';
      if (isOSSImg) {
        if (prev == '_') {
          prev = '@';
        }
        if (uri.split('@')[1]) {
          prev = '';
        }
      }

      if (notGif) {
        if (suffixRet[0] !== '_.jpg') {
          newUrl = newUrl.replace(suffixRet[0], '');
        }


        if (isOSSImg) {
          newUrl += prev +
          scalingSuffix +
          cut +
          _compressSuffix +
          webpSuffix;
        } else {
          newUrl += prev +
          scalingSuffix +
          cut +
          _compressSuffix +
          suffix +
          webpSuffix;
        }


        if (removeScheme) {
          newUrl = removeUrlScheme(newUrl);
        }
      }

      if (replaceDomain) {
        newUrl = replaceUrlDomain(newUrl, host);
      }
    }
  }

  return newUrl;
}
