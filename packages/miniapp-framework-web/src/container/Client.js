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

  show() {
    super.show();
  }

  hide() {
    super.hide();
  }
}


/**
 * Get unique client id.
 * @return {String} clientId
 */
function createClientId() {
  return 'client-' + clinetCount ++;
}
