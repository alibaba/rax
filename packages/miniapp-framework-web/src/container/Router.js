import resolvePathname from 'resolve-pathname';
import { createMessageProxy } from './MessageProxy';
import Client from './Client';

const ROUTE_HASH_PREFIX = '!/';
export default class Router {
  /**
   * Container Router
   * @param container {HTMLElement} Element to render miniapp.
   * @param messageRouter {MessageRouter} Message channels.
   */
  constructor(container = document.body, messageRouter) {
    this.container = container;
    this.messageRouter = messageRouter;
    this.clients = [];
    this.tabClients = {}; // pageName -> client
    this.currentClient = null;
  }

  parseRouterParam(params = {}) {
    let { pageName } = params;
    const pageQuery = {};
    if (pageName[0] === '/') {
      pageName = pageName.slice(1);
    } else if (pageName[0] === '.') {
      pageName = resolvePathname(pageName, this.currentClient.renderer.pageName);
    }

    if (/\?/.test(pageName)) {
      let queryString;
      [pageName, queryString] = pageName.split('?');
      Object.assign(pageQuery, decodeQuerystring(queryString));
    }

    return { pageName, pageQuery };
  }

  navigateTo(params) {
    const { pageName, pageQuery } = this.parseRouterParam(params);
    location.hash = ROUTE_HASH_PREFIX + pageName;

    const client = new Client(pageName, {
      prevClientId: this.currentClient ? this.currentClient.clientId : null,
      pageQuery,
    });
    this.clients.push(client);
    if (params.isTab) {
      this.tabClients[pageName] = client;
    }

    const messageProxy = createMessageProxy(this.messageRouter, client.clientId, pageName);
    this.messageRouter.addChannel(client.clientId, messageProxy);

    if (this.currentClient) {
      // PageLifecycle.emit('hide', currentClient.clientId);
      this.currentClient.hide();
      // PageLifecycle.emit('show', clientId);
      // currentClient.nextClient = client;
    }

    // 初始化的 show 事件由 worker render 后直接触发
    client.mount(this.container);
    client.prevClient = this.currentClient;
    this.currentClient = client;
  }
  navigateBack() {}
  redirect() {}

  switchTab(params) {
    const { pageName } = this.parseRouterParam(params);
    if (this.tabClients[pageName]) {
      this.currentClient && this.currentClient.hide();
      const client = this.currentClient = this.tabClients[pageName];
      client.show();
    } else {
      this.navigateTo({
        ...params,
        isTab: true,
      });
    }
  }
}

function isPluginName(str) {
  return /^plugin:/.test(str);
}

function isUrl(str) {
  return /^([\w\d]+:)\/\//.test(str);
}

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function decodeQuerystring(qs) {
  const sep = '&';
  const eq = '=';
  let obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  let regexp = /\+/g;
  qs = qs.split(sep);
  let maxKeys = 1000;
  let len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (let i = 0; i < len; ++i) {
    let x = qs[i].replace(regexp, '%20'),
      idx = x.indexOf(eq),
      kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};
