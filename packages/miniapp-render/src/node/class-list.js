export default class ClassList extends Set {
  static _create(className, element) {
    const instance = new Set();
    instance.__proto__ = ClassList.prototype;
    instance.__element = element;
    className.trim().split(/\s+/).forEach((s) => s !== '' && instance.add(s));
    return instance;
  }

  get value() {
    const classArray = [];
    this.forEach(item => classArray.push(item));
    return classArray.join(' ');
  }
  add(s) {
    if (typeof s === 'string' && s !== '') {
      super.add(s);
      this._update();
    }

    return this;
  }

  remove(s) {
    super.delete(s);
    this._update();
  }

  replace(s1, s2) {
    super.delete(s1);
    super.add(s2);

    this._update();
  }

  contains(s) {
    return this.has(s);
  }

  item(index) {
    let count = 0;
    for (let i of this) {
      if (count === index) {
        return i;
      }
      count ++;
    }
    return undefined;
  }

  toggle(token, force) {
    if (force !== undefined) {
      force === true ? this.add(token) : this.remove(token);
      return force;
    }

    if (this.has(token)) {
      this.remove(token);
      return false;
    } else {
      this.add(token);
      return true;
    }
  }

  toString() {
    return this.value;
  }

  _update() {
    this.__element.className = this.value;
  }
}
