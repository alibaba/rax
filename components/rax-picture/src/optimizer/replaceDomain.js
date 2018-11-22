const DEFAULT_HOSTNAME = 'gw.alicdn.com';
const ALI_HOST = /(.+\.(?:alicdn|taobaocdn|taobao|mmcdn)\.com)/;
const filterDomains = [
  'a.tbcdn.cn',
  'assets.alicdn.com',
  'wwc.taobaocdn.com',
  'wwc.alicdn.com',
  'cbu01.alicdn.com',
  'ossgw.alicdn.com'
];

/**
 * use gw.alicdn.com
 *
 * @param url
 * @param host
 * @returns {String}
 */
export default function(url, host) {
  const hostReg = host.match(ALI_HOST);
  if (hostReg && hostReg[0] != DEFAULT_HOSTNAME) {
    if (filterDomains.indexOf(host) === -1) {
      return url.replace(host, DEFAULT_HOSTNAME);
    }
  }
  return url;
}
