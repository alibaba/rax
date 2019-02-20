/**
 * Deperated location handler.
 */
export default class LocationHandler {
  constructor(sender) {
    this.sender = sender;
  }

  apply(data) {
    const { data: payload } = data;
    const { type, prop } = payload;

    if (type === 'call' && prop === 'replace') {
      location.replace(payload.args[0]);
    }
  }
}
