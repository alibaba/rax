import qs from 'querystring';

const env = getSFCEnvironmentObject();
/**
 * In general, native both iOS and Android will
 * inject env variable by __sfc__ namespace.
 * HACK for Android webview: in some case, android
 * can not inject an object, but can get object by
 * call __sfc__.getRawJSON() to return a JSON of __sfc__.
 * @returns {*}
 */
function getSFCEnvironmentObject() {
  const isEnvExists = typeof __sfc__ !== 'undefined';
  if (!isEnvExists) {
    return null;
  } else if (typeof __sfc__.getRawJSON !== 'undefined') { // eslint-disable-line
    return JSON.parse(__sfc__.getRawJSON()); // eslint-disable-line
  } else {
    return __sfc__; // eslint-disable-line
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
  const { href } = location;
  const match = (new RegExp(`${param}=([^&]+)`)).exec(href);

  if (match) {
    return decodeURIComponent(match[1]);
  } else {
    return '$unknown';
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

  return qs.parse(searchString);
}
