const webpSuffix = '_.webp';
const ossWebpSuffix = '.webp';

/**
 * @param url
 * @param path
 * @returns {String}
 */
export default function(isOSSImg) {
  if (isOSSImg) {
    return ossWebpSuffix;
  } else {
    return webpSuffix;
  }
}
