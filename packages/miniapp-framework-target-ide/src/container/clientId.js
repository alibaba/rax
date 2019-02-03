let id = 0;

/**
 * Get unique client id.
 * @return {String} clientId
 */
export function createClientId() {
  return 'client-' + id ++;
}
