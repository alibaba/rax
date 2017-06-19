//import isCdnImage from './isCdnImage';
//var toString = {}.toString;
//let isArray = Array.isArray || function(arr) {
//  return toString.call(arr) == '[object Array]';
//};

/**
 * 添加图片质量后缀
 * @param  {Number} quality [质量]
 * @param  {Number} acutance [锐度]
 * @return {String}        [后缀]
 */
export default function(compressSuffix, quality, acutance) {
  return compressSuffix ? compressSuffix : (
    (quality ? 'Q' + quality : '') + (acutance ? 'S' + acutance : '')
  );
}
