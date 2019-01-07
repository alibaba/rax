import Renderer from './Renderer';
import { createClientId } from './utils';
import { warn } from '../../../core/debugger';
import qs from 'querystring';
import resolvePathname from 'resolve-pathname';

const ROUTE_HASH_PREFIX = '!/';
// const APP_MANIFEST = getManifest();

const PREV_EL = document.querySelector('#prev');
function showPrev() {
  PREV_EL.style.visibility = '';
}
function hidePrev() {
  PREV_EL.style.visibility = 'hidden';
}
// hidePrev();

const PageLifecycle = {
  emit(type, clientId) {
    window.$$worker.postMessage({
      type: 'page:lifecycle',
      lifecycle: type,
      clientId,
    });
  }
};

let currentClient = null;
const container = document.querySelector('#main');

export function navigate({ pageName }) {
  if (/^([\w\d]+:)\/\//.test(pageName)) {
    // is url
    location.href = pageName;
    return;
  } else if (pageName[0] === '/') {
    pageName = pageName.slice(1);
  } else if (pageName[0] === '.') {
    pageName = resolvePathname(pageName, currentClient.renderer.pageName);
  }
  location.hash = ROUTE_HASH_PREFIX + pageName;

  let query = {};
  if (/\?/.test(pageName)) {
    const [_pageName, queryString] = pageName.split('?');
    pageName = _pageName;
    query = qs.parse(queryString);
  }

  const clientId = createClientId();
  const renderer = new Renderer(pageName, clientId, {
    currentClientId: getClientId(currentClient),
    pageQuery: query
  });
  const client = createClient(clientId, renderer);

  if (currentClient) {
    PageLifecycle.emit('hide', currentClient.clientId);
    currentClient.renderer.hide();
    showPrev();
    PageLifecycle.emit('show', clientId);
    currentClient.nextClient = client;
  }

  // 初始化的 show 事件由 worker render 后直接触发
  renderer.mount(container);
  client.prevClient = currentClient;
  currentClient = client;
}

export function redirect({ pageName }) {
  navigateBack();
  navigate({ pageName });
}

export function navigateBack() {
  if (currentClient && currentClient.prevClient) {
    currentClient.renderer.destroy();
    PageLifecycle.emit('hide', currentClient.clientId);

    currentClient = currentClient.prevClient;
    currentClient.renderer.show();

    location.hash = ROUTE_HASH_PREFIX + currentClient.renderer.pageName;
    PageLifecycle.emit('show', currentClient.clientId);

    if (!currentClient.prevClient) {
      hidePrev();
    }
  } else {
    hidePrev();
    warn('已经到最底层页面');
  }
}

export function switchTab({ pageName }) {
  if (!currentClient) {
    return;
  }
  function findSwitch(sourceClient, pageName) {
    if (sourceClient.renderer.pageName === pageName) {
      return sourceClient;
    } else if (sourceClient.prevClient) {
      return findSwitch(sourceClient.prevClient, pageName);
    } else {
      return null;
    }
  }
  const target = findSwitch(currentClient, pageName);
  if (target === currentClient) {
    return;
  }
  if (target) {
    target.nextClient.prevClient = null;
    target.nextClient = null;
    currentClient.nextClient = target;
    target.prevClient = currentClient;
    target.nextClient = null;

    currentClient.renderer.hide();
    currentClient = target;
    target.renderer.show();
    location.hash = ROUTE_HASH_PREFIX + target.renderer.pageName;
  } else {
    navigate({ pageName });
  }
}

function createClient(clientId, renderer) {
  return {
    prevClient: null,
    nextClient: null,
    clientId,
    renderer
  };
}

function getClientId(client) {
  if (client) {
    return client.clientId;
  } else {
    return null;
  }
}

export function getCurrentClientId() {
  return currentClient ? currentClient.clientId : null;
}

// 为了检查当前页面是否属于 tabbar，需要去读取 APP_MANIFEST
function getTabBarList() {
  return APP_MANIFEST.tabBar ? APP_MANIFEST.tabBar.list : [];
}

export function checkPathInTabBar(pageName) {
  const list = getTabBarList();
  return list.some(item => item.pageName === pageName);
}

export default class MiniAppRouter {
  navigateTo() {}
  navigateBack() {}
  redirect() {}
  switchTab() {}
}
