import resolvePathname from 'resolve-pathname';
import { log } from 'miniapp-framework-shared';
import Client from './Client';

const ROUTE_HASH_PREFIX = '#!/';
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
    this.listeners = [];

    /**
     * Listen to browser's history events.
     */
    window.addEventListener('popstate', this.onPopState);
  }

  onPopState = (event) => {
    const state = event.state;
    if (
      state && state.clientId
      && this.currentClient && this.currentClient.prevClient
      && state.clientId === this.currentClient.prevClient.clientId
    ) {
      this.navigateBack({
        replaceState: true
      });
    } else {
      let hash = location.hash;
      if (hash && hash.indexOf(ROUTE_HASH_PREFIX) === 0) {
        hash = hash.slice(ROUTE_HASH_PREFIX.length);
      }

      this.navigateTo({
        pageName: hash,
        replaceState: true,
      });
    }
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

    const client = new Client(pageName, {
      prevClientId: this.currentClient ? this.currentClient.clientId : null,
      pageQuery,
    });
    this.clients.push(client);
    if (params.isTab) {
      this.tabClients[pageName] = client;
      client.isTab = true;
    }

    const clientId = client.clientId;
    client.channel = this.messageRouter.createMessageChannel(clientId, {
      clientId, pageName,
    });

    if (this.currentClient) this.currentClient.hide();

    client.mount(this.container);
    client.prevClient = this.currentClient;

    // @Note: Use origin path from `params.pageName`, or the querystring will be dropped.
    const originPath = params.pageName[0] === '/' ? params.pageName.slice(1) : params.pageName;
    const hash = ROUTE_HASH_PREFIX + originPath;
    if (params.replaceState || !this.currentClient) {
      history.replaceState({ clientId }, null, hash);
    } else {
      history.pushState({ clientId }, null, hash);
    }

    this.currentClient = client;

    this.notifyListeners();
  }

  /**
   * Back to prev client page.
   * @param params.delta {Number} The number of back pages.
   * @param params.replaceState {Boolean} Weather to replace state of history.
   *
   */
  navigateBack(params = {}) {
    let delta = params.delta || 1;

    /**
     * While executing navigateBack method, call histroy.go to sync browser's navigator.
     */
    if (!params.replaceState) {
      history.go(-delta);
      return;
    }

    let prevClient = this.currentClient;
    do {
      prevClient = prevClient.prevClient;
    } while (--delta && prevClient);

    if (prevClient) {
      this.currentClient.destroy();
      this.currentClient = prevClient;
      this.currentClient.show();
    } else {
      log('No prev page at all.');
    }

    this.notifyListeners();
  }

  /**
   * Redirect to some page, instead of current page.
   */
  redirectTo(params) {
    const prevClient = this.currentClient.prevClient;
    this.currentClient.destroy();
    this.currentClient = prevClient;

    this.navigateTo({
      pageName: params.pageName,
      replaceState: true
    });
  }

  switchTab(params) {
    const { pageName } = this.parseRouterParam(params);
    if (this.tabClients[pageName]) {
      this.currentClient && this.currentClient.hide();
      const client = this.currentClient = this.tabClients[pageName];

      const hash = ROUTE_HASH_PREFIX + pageName;
      history.replaceState({clientId: client.clientId}, null, hash);

      client.show();

      this.notifyListeners();
    } else {
      this.navigateTo({
        ...params,
        isTab: true,
      });
    }
  }

  notifyListeners() {
    this.listeners.forEach(listener => {
      listener && listener(this.currentClient);
    });
  }

  removeListener(index) {
    this.listeners[index] = null;
  }

  listen(fn) {
    this.listeners.push(fn);
    return () => {
      this.removeListener(this.listeners.length);
    };
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
}
