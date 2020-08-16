export default class EvaluationHandler {
  constructor(sender) {
    this.sender = sender;
  }

  apply({ data }) {
    const { type } = data;
    this[type](data);
  }

  returnSuccess(id, success) {
    if (typeof success === 'object') {
      try {
        success = JSON.parse(JSON.stringify(success));
      } catch (e) {
        success = success.toString();
      }
    }

    if (typeof success === 'function') {
      success = success.toString();
    }

    this.send({ type: 'success', id, success });
  }

  returnError(id, { name, message }) {
    this.send({ type: 'error', id, error: { name, message } });
  }

  send(data) {
    this.sender({
      type: 'return',
      return: data,
    });
  }

  eval({ id, code }) {
    try {
      this.returnSuccess(id, window.eval(code));
    } catch (error) {
      this.returnError(id, error);
    }
  }
}
