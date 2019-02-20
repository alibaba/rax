/* global frameworkType */
import WebRenderer from './WebRenderer';
import IDERenderer from './IDERenderer';

let clinetCount = 0;
const BaseRenderer = frameworkType === 'web' ? WebRenderer : IDERenderer;

export default class Client extends BaseRenderer {
  constructor(pageName, options = {}) {
    const clientId = createClientId();
    super(pageName, clientId, options);
  }

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
