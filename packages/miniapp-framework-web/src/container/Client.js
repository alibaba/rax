import WebRenderer from './WebRenderer';
let clinetCount = 0;

export default class Client extends WebRenderer {
  constructor(pageName, options = {}) {
    const clientId = createClientId();
    super(pageName, clientId, options);
  }
}


/**
 * Get unique client id.
 * @return {String} clientId
 */
function createClientId() {
  return 'client-' + clinetCount ++;
}
