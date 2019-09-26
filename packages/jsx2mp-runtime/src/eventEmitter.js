let count = 0;
export default class ValueEmitter {
  constructor(defaultValue) {
    this.id = count++;
    this.handlers = [];
    this.value = defaultValue;
  }

  on(handler) {
    this.handlers.push(handler);
  }

  off(handler) {
    this.handlers = this.handlers.filter(h => h !== handler);
  }

  emit() {
    this.handlers.forEach(handler => handler(this.value));
  }
}
