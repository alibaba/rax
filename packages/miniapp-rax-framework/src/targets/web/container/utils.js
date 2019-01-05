export function getManifest() {
  const APP_MANIFEST = window.APP_MANIFEST;
  if (typeof APP_MANIFEST === 'undefined' || !APP_MANIFEST.h5Assets) {
    throw new Error('页面信息未加载');
  }
  return APP_MANIFEST;
}

export function getContainer() {
  return document.querySelector('#main') || document.body;
}

export function getHeaderBar() {
  return document.querySelector('#headerBar');
}

export function getTabBar() {
  return document.querySelector('#tabBar');
}

let clientIds = 0;
export function createClientId() {
  return `client-${++clientIds}`;
}

export function findHomePage(APP_MANIFEST) {
  const hashRoute = location.hash.replace(/^#?!\//, '');
  if (hashRoute !== '') {
    return hashRoute;
  }
  if ('homepage' in APP_MANIFEST) {
    return APP_MANIFEST.homepage;
  }
  return Object.keys(APP_MANIFEST.pages)[0];
}
