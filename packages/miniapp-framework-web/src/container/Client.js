/* global frameworkType */
import WebRenderer from '../renderer/WebRenderer';
import IframeRenderer from '../renderer/IframeRenderer';

let clinetCount = 0;
const BaseRenderer = frameworkType === 'web' ? WebRenderer : IframeRenderer;

export default class Client extends BaseRenderer {
  constructor(pageName, options = {}) {
    const clientId = createClientId();
    super(pageName, clientId, options);
  }

  channel = {};

  emitLifeCycle(type) {
    this.channel.postMessage && this.channel.postMessage({
      type: 'page:lifecycle',
      lifecycle: type
    });
  }

  show() {
    super.show();
    this.emitLifeCycle('show');
  }

  hide() {
    super.hide();
    this.emitLifeCycle('hide');
  }

  destroy() {
    super.destroy();
    this.emitLifeCycle('unload');
  }
}


/**
 * Get unique client id.
 * @return {String} clientId
 */
function createClientId() {
  return 'client-' + clinetCount ++;
}
