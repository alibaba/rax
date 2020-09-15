export default class ClassList extends Set {
  constructor(className, element) {
    super();
    className.trim().split(/\s+/).forEach((s) => s !== '' && super.add(s));
    this.__element = element;
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

  toString() {
    return this.value;
  }

  _update() {
    this.__element.className = this.value;
  }
}
