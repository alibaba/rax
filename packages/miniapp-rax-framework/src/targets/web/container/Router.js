import Renderer from './Renderer';
import qs from 'querystring';
import resolvePathname from 'resolve-pathname';
import { createMessageProxy } from './MessageProxy';
import RendererClient, { createClientId } from './Client';

const ROUTE_HASH_PREFIX = '!/';
export default class ContainerRouter {
  /**
   * Container Router
   * @param container {HTMLElement} Element to render miniapp.
   * @param messageRouter {MessageRouter} Message channels.
   */
  constructor(container = document.body, messageRouter) {
    this.container = container;
    this.messageRouter = messageRouter;
    this.currentClient = null;
  }

  navigateTo(params) {
    let { pageName } = params;
    const container = document.querySelector('#main');
    if (isUrl(pageName)) {
      location.href = pageName;
    } else if (pageName[0] === '/') {
      pageName = pageName.slice(1);
    } else if (pageName[0] === '.') {
      pageName = resolvePathname(pageName, this.currentClient.renderer.pageName);
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
      currentClientId: this.currentClient.clientId,
      pageQuery: query
    });
    const messageProxy = createMessageProxy(this.messageRouter, clientId, pageName);
    this.messageRouter.addChannel(clientId, messageProxy);

    if (this.currentClient) {
      // PageLifecycle.emit('hide', currentClient.clientId);
      this.currentClient.renderer.hide();
      // PageLifecycle.emit('show', clientId);
      // currentClient.nextClient = client;
    }

    // 初始化的 show 事件由 worker render 后直接触发
    renderer.mount(container);
    // client.prevClient = currentClient;
    // currentClient = client;
  }
  navigateBack() {}
  redirect() {}
  switchTab() {}
}

function isPluginName(str) {
  return /^plugin:/.test(str);
}

function isUrl(str) {
  return /^([\w\d]+:)\/\//.test(str);
}
