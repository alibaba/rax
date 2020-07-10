import cache from './cache';

class Performance {
  constructor() {
    this.recorder = new Map();
  }

  start(id) {
    const { debug } = cache.getConfig();
    if (!debug) {
      return;
    }
    this.recorder.set(id, Date.now());
  }

  stop(id) {
    const { debug } = cache.getConfig();
    if (!debug) {
      return;
    }
    const now = Date.now();
    const prev = this.recorder.get(id);
    if (!prev) {
      console.warn(`${id} hasn't invoke start method, please check your code!`);
      return;
    }
    const time = now - prev;
    console.log(`${id} Take: ${time}ms`);
  }
}

export default new Performance();
