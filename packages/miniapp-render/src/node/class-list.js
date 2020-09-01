export default class ClassList extends Set {
  constructor(className, element) {
    super();
    className.trim().split(/\s+/).forEach(super.add.bind(this));
    this.__element = element;
  }

  get value() {
    return [...this].join(' ');
  }

  add(s) {
    if (typeof s === 'string') {
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

  toString() {
    return this.value;
  }

  _update() {
    this.__element.className = this.value;
  }
}
