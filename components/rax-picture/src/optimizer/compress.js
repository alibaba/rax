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
