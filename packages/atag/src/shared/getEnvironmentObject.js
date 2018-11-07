/* global __sfc__ */
/**
 * In general, native both iOS and Android will
 * inject env variable by __sfc__ namespace.
 * HACK for Android webview: in some case, android
 * can not inject an object, but can get object by
 * call __sfc__.getRawJSON() to return a JSON of __sfc__.
 */
export default function getEnvironmentObject() {
  const isEnvExists = typeof __sfc__ !== 'undefined';
  if (!isEnvExists) {
    return null;
  } else if (typeof __sfc__.getRawJSON !== 'undefined') {
    return JSON.parse(__sfc__.getRawJSON());
  } else {
    return __sfc__;
  }
}
