import Event from './events';

let count = 0;

export default class ValueEmitter extends Event {
  constructor(defaultValue) {
    super();
    this.id = `valueEmitter_${count++}`;
    this.value = defaultValue;
  }

  on(handler) {
    super.on(this.id, handler);
  }

  off(handler) {
    super.off(this.id, handler);
  }

  emit() {
    super.emit(this.id, this.value);
  }
}
