// import isCdnImage from './isCdnImage';
// var toString = {}.toString;
// let isArray = Array.isArray || function(arr) {
//  return toString.call(arr) == '[object Array]';
// };

/**
 * @param  {Number} quality
 * @param  {Number} acutance
 * @return {String}       
 */
export default function(compressSuffix, quality, acutance) {
  return compressSuffix ? compressSuffix :
    (quality ? 'Q' + quality : '') + (acutance ? 'S' + acutance : '')
  ;
}
