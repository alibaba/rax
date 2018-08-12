/**
 * @param url
 * @returns {String}
 */
export default function(url) {
  return url.replace(/(http|https):/gi, '');
}
