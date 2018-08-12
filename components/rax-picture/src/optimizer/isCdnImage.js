const REG_IMG_URL = /^(?:(?:http|https):)?\/\/(.+\.(?:alicdn|taobaocdn|taobao)\.(?:com|net))(\/.*(?:\.(jpg|png|gif|jpeg|webp))?)$/i;

/**
 * @param url
 * @returns {Bool}
 */
export default function(url) {
  return url.match(REG_IMG_URL);
}
