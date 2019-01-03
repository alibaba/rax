import { warn } from '../../core/debugger';
import getAppConfig from './container/getAppConfig';


const appConfig = getAppConfig();

const PageLifecycle = {
  emit(type, clientId) {
    window.$$worker.postMessage({
      type: 'page:lifecycle',
      lifecycle: type,
      clientId,
    });
  }
};


function redirect({ pageName }) {
  navigateBack();
  navigate({ pageName });
}

function navigateBack() {
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

function switchTab({ pageName }) {
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
  return appConfig.tabBar ? appConfig.tabBar.list : [];
}

export function checkPathInTabBar(pageName) {
  const list = getTabBarList();
  return list.some(item => item.pageName === pageName);
}

