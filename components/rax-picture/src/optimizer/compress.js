/**
 * @param  {Number} quality
 * @param  {Number} acutance
 * @return {String}
 */
export default function(compressSuffix, quality, acutance, isOSSImg) {
  console.error('isOSSImg', isOSSImg, compressSuffix);
  if (isOSSImg) {
    // @90q（Q） ['@75q', '@50q']
    console.error(typeof compressSuffix);
    console.error(compressSuffix.startsWith);
    if (compressSuffix.startsWith('Q')) {
      compressSuffix = '_' + compressSuffix.split('Q')[1] + 'Q';
    }
    return compressSuffix ? compressSuffix :
      quality ? '_' + quality : 'Q'
    ;
  } else {
    // _Q(q)90 ['Q75', 'Q50']
    return compressSuffix ? compressSuffix :
      (quality ? 'Q' + quality : '') + (acutance ? 'S' + acutance : '')
    ;
  }
}
