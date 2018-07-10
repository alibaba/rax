export default class Set {
  constructor(data) {
    this.data = data || [];
  }

  has(id) {
    for (let i = 0, l = this.data.length; i < l; i++) {
      if (this.data[i] === id) {
        return true;
      }
    }
    return false;
  }

  add(id) {
    if (!this.has(id)) {
      this.data.push(id);
    }
    return this;
  }

  clear() {
    this.data = [];
  }
}
