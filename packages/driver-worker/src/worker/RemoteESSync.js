export default class RemoteESSync {
  constructor(sender, receiver) {
    this.receiver = receiver;
    this.sender = sender;
  }

  resolve(processId, result) {
    this.send({ processId, result });
  }
  reject(processId, error) {
    this.send({ processId, error });
  }

  send(data) {
    this.sender && this.sender({
      type: 'RemoteESSync',
      data,
    });
  }
}
