export default class RemoteDOMSyncHandler {
  costructor(sender) {
    this.sender = sender;
  }

  apply(data) {
    const { type, payload } = data;
  }
}
