let clinetCount = 0;

export default class RendererClient {
  constructor() {

  }
}


/**
 * Get unique client id.
 * @return {String} clientId
 */
export function createClientId() {
  return 'client-' + clinetCount ++;
}
