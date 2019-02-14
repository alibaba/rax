/* global __sfc__ */
import decodeQueryString from './decodeQueryString';

const UNKNOWN = '$unknown';
export const env = getSFCEnvironmentObject();

/**
 * In general, native both iOS and Android will
 * inject env variable by __sfc__ namespace.
 * HACK for Android webview: in some case, android
 * can not inject an object, but can get object by
 * call __sfc__.getRawJSON() to return a JSON of __sfc__.
 */
function getSFCEnvironmentObject() {
  const isEnvExists = typeof __sfc__ !== 'undefined';
  if (!isEnvExists) {
    return null;
  } else if (typeof __sfc__.getRawJSON !== 'undefined') {
    return JSON.parse(__sfc__.getRawJSON());
  } else {
    return __sfc__;
  }
}

export function getClientId() {
  if (env) {
    return env.options.clientId;
  } else {
    return extractQuery('clientId');
  }
}

export function getPageName() {
  if (env) {
    return env.options.pageName;
  } else {
    return extractQuery('pageName');
  }
}

function extractQuery(param) {
  const match = (new RegExp(`${param}=([^&]+)`)).exec(location.href);

  if (match) {
    return decodeURIComponent(match[1]);
  } else {
    return UNKNOWN;
  }
}

/**
 * make query objective
 */
export function parsePageQuery() {
  let searchString = location.search || '';
  if (searchString[0] === '?') {
    searchString = searchString.slice(1);
  }

  return decodeQueryString(searchString);
}
